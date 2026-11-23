import { handleWritingRequest } from '../../server/writingHttp.js'

export function onRequest({ request, env }) {
  return handleWritingRequest(request, env)
}
