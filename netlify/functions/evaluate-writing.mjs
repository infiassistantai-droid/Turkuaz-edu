import { EssayEvaluatorError, evaluateEssayWithGemini } from '../../server/essayEvaluator.js'

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(payload),
})

function getBearerToken(headers = {}) {
  const authorization = headers.authorization || headers.Authorization || ''
  const match = /^Bearer\s+(.+)$/iu.exec(authorization)
  return match?.[1] || ''
}

async function verifySupabaseUser(token) {
  const url = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/u, '')
  const anonKey = String(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim()
  if (!url || !anonKey) throw new EssayEvaluatorError('SUPABASE_AUTH_NOT_CONFIGURED', 503)
  if (!token) throw new EssayEvaluatorError('UNAUTHORIZED', 401)

  let response
  try {
    response = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new EssayEvaluatorError('AUTH_SERVICE_UNAVAILABLE', 503)
  }
  if (!response.ok) throw new EssayEvaluatorError('UNAUTHORIZED', 401)
  return response.json()
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return jsonResponse(405, { code: 'METHOD_NOT_ALLOWED' })

  const apiKey = String(process.env.GEMINI_API_KEY || '').trim()
  if (!apiKey) return jsonResponse(503, { code: 'AI_NOT_CONFIGURED' })

  try {
    await verifySupabaseUser(getBearerToken(event.headers))
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : event.body || ''
    if (Buffer.byteLength(rawBody, 'utf8') > 65_536) throw new EssayEvaluatorError('INVALID_REQUEST', 413)

    let input
    try {
      input = JSON.parse(rawBody)
    } catch {
      throw new EssayEvaluatorError('INVALID_REQUEST', 400)
    }

    const result = await evaluateEssayWithGemini(input, {
      apiKey,
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    })
    return jsonResponse(200, result)
  } catch (error) {
    const statusCode = error instanceof EssayEvaluatorError ? error.status : 500
    const code = error instanceof EssayEvaluatorError ? error.code : 'AI_SERVICE_ERROR'
    return jsonResponse(statusCode, { code })
  }
}
