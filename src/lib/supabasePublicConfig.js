export function isPublicSupabaseKey(value) {
  if (typeof value !== 'string') return false
  if (value.startsWith('sb_publishable_')) return value.length > 'sb_publishable_'.length
  if (!/^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u.test(value)) return false
  try {
    const payload = value.split('.')[1].replace(/-/gu, '+').replace(/_/gu, '/')
    return JSON.parse(atob(payload)).role === 'anon'
  } catch {
    return false
  }
}

export function normalizeSupabaseUrl(value) {
  const raw = String(value ?? '').trim().replace(/\/rest\/v1\/?$/iu, '').replace(/\/+$/u, '')
  if (!raw) return ''
  try {
    const parsed = new URL(raw)
    const localHttp = parsed.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
    if ((!localHttp && parsed.protocol !== 'https:') || parsed.username || parsed.password) return ''
    if (parsed.pathname !== '/' || parsed.search || parsed.hash) return ''
    return parsed.origin
  } catch {
    return ''
  }
}
