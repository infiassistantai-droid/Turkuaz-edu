import { handleWritingRequest } from '../../server/writingHttp.js'

export async function handler(event) {
  const method = event.httpMethod
  const body = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64') : event.body || ''
  const request = new Request('https://turkuaz.invalid/api/evaluate-writing', {
    method,
    headers: Object.entries(event.headers || {}).filter(([, value]) => value != null),
    ...(method === 'POST' ? { body } : {}),
  })
  const response = await handleWritingRequest(request, process.env)
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.text(),
  }
}

