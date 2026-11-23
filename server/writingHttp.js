import { EssayEvaluatorError, evaluateEssayWithGemini } from './essayEvaluator.js'
import { isPublicSupabaseKey, normalizeSupabaseUrl } from '../src/lib/supabasePublicConfig.js'

const MAX_BODY = 65_536

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
})

async function readInput(request) {
  if (!request.body) throw new EssayEvaluatorError('INVALID_REQUEST', 400)
  if (Number(request.headers.get('content-length')) > MAX_BODY) throw new EssayEvaluatorError('INVALID_REQUEST', 413)
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let bytes = 0
  let text = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_BODY) {
        void reader.cancel().catch(() => {})
        throw new EssayEvaluatorError('INVALID_REQUEST', 413)
      }
      text += decoder.decode(value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  } catch (error) {
    if (error instanceof EssayEvaluatorError) throw error
    throw new EssayEvaluatorError('INVALID_REQUEST', 400)
  } finally {
    reader.releaseLock()
  }
}

async function requireUser(request, env) {
  const token = /^Bearer\s+(\S+)$/iu.exec(request.headers.get('authorization') || '')?.[1]
  if (!token) throw new EssayEvaluatorError('UNAUTHORIZED', 401)
  const url = normalizeSupabaseUrl(env.SUPABASE_URL || env.VITE_SUPABASE_URL)
  const key = String(env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || '').trim()
  if (!url || !isPublicSupabaseKey(key)) throw new EssayEvaluatorError('SUPABASE_AUTH_NOT_CONFIGURED', 503)

  let result
  try {
    result = await fetch(url + '/auth/v1/user', {
      headers: { apikey: key, Authorization: 'Bearer ' + token },
      redirect: 'error',
      signal: AbortSignal.timeout(7000),
    })
  } catch {
    throw new EssayEvaluatorError('AUTH_SERVICE_UNAVAILABLE', 503)
  }
  if (result.status === 401 || result.status === 403) throw new EssayEvaluatorError('UNAUTHORIZED', 401)
  if (!result.ok) throw new EssayEvaluatorError('AUTH_SERVICE_UNAVAILABLE', 503)
}

export async function handleWritingRequest(request, env) {
  if (request.method !== 'POST') return json(405, { code: 'METHOD_NOT_ALLOWED' })
  try {
    await requireUser(request, env)
    const input = await readInput(request)
    const result = await evaluateEssayWithGemini(input, {
      apiKey: String(env.GEMINI_API_KEY || '').trim(),
      model: env.GEMINI_MODEL || undefined,
    })
    return json(200, result)
  } catch (error) {
    return error instanceof EssayEvaluatorError
      ? json(error.status, { code: error.code })
      : json(500, { code: 'AI_SERVICE_ERROR' })
  }
}
