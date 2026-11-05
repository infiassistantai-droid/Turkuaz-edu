import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { EssayEvaluatorError, evaluateEssayWithGemini } from './server/essayEvaluator.js'

function writeJson(response, statusCode, payload) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(payload))
}

async function readJsonBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 65_536) throw new EssayEvaluatorError('INVALID_REQUEST', 413)
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new EssayEvaluatorError('INVALID_REQUEST', 400)
  }
}

function localAiEvaluator(env) {
  return {
    name: 'local-server-side-ai-evaluator',
    configureServer(server) {
      // Development-only endpoint. The GEMINI_API_KEY is read by Vite's Node process,
      // never added to import.meta.env or the browser bundle.
      server.middlewares.use('/api/evaluate-writing', async (request, response) => {
        if (request.method !== 'POST') {
          writeJson(response, 405, { code: 'METHOD_NOT_ALLOWED' })
          return
        }
        try {
          const input = await readJsonBody(request)
          const result = await evaluateEssayWithGemini(input, {
            apiKey: env.GEMINI_API_KEY,
            model: env.GEMINI_MODEL,
            debug: true,
          })
          writeJson(response, 200, result)
        } catch (error) {
          const status = error instanceof EssayEvaluatorError ? error.status : 500
          const code = error instanceof EssayEvaluatorError ? error.code : 'AI_SERVICE_ERROR'
          const payload = { code }
          if (error instanceof EssayEvaluatorError && error.debugResponse) payload.rawResponse = error.debugResponse
          writeJson(response, status, payload)
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), localAiEvaluator(env)],
    server: {
      host: true,
      port: 5173,
      allowedHosts: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})
