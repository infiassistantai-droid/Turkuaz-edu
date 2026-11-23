import { Readable } from 'node:stream'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleWritingRequest } from './server/writingHttp.js'
import { isPublicSupabaseKey, normalizeSupabaseUrl } from './src/lib/supabasePublicConfig.js'

function localWritingEvaluator(env) {
  function install(server) {
    server.middlewares.use(async (request, response, next) => {
      const path = request.url?.split('?')[0]
      if (path !== '/api/evaluate-writing' && path !== '/api/evaluate-writing/') return next()
      const headers = Object.entries(request.headers).flatMap(([key, value]) =>
        value == null ? [] : [[key, Array.isArray(value) ? value.join(', ') : value]])
      const incoming = new Request('http://localhost/api/evaluate-writing', {
        method: request.method,
        headers,
        ...(request.method === 'POST' ? { body: Readable.toWeb(request), duplex: 'half' } : {}),
      })
      const result = await handleWritingRequest(incoming, env)
      response.writeHead(result.status, Object.fromEntries(result.headers))
      response.end(await result.text())
    })
  }

  return {
    name: 'local-writing-evaluator',
    configureServer: install,
    configurePreviewServer: install,
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const key = String(env.VITE_SUPABASE_ANON_KEY || '').trim()
  if ((key.startsWith('sb_secret_') || key.startsWith('eyJ')) && !isPublicSupabaseKey(key)) {
    throw new Error('VITE_SUPABASE_ANON_KEY must be a publishable key or an anon JWT.')
  }

  const publicEnv = {
    VITE_SUPABASE_URL: normalizeSupabaseUrl(env.VITE_SUPABASE_URL),
    VITE_SUPABASE_ANON_KEY: isPublicSupabaseKey(key) ? key : '',
    VITE_WINTER_UPDATE_ENABLED: env.VITE_WINTER_UPDATE_ENABLED || '',
    VITE_WINTER_UPDATE_AUTO: env.VITE_WINTER_UPDATE_AUTO || '',
  }

  return {
    plugins: [react(), localWritingEvaluator(env)],
    envPrefix: [],
    define: Object.fromEntries(Object.entries(publicEnv).map(([key, value]) => ['import.meta.env.' + key, JSON.stringify(value)])),
    server: { host: true, port: 5173 },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/@supabase/')) return 'vendor-supabase'
            if (/\/node_modules\/(react|react-dom|scheduler)\//u.test(id)) return 'vendor-react'
          },
        },
      },
    },
  }
})

