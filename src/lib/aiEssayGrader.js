import { isSupabaseConfigured, supabase } from './supabase.js'
import { parseJsonResponse } from './parseJsonResponse.js'

const endpoint = import.meta.env.DEV
  ? '/api/evaluate-writing'
  : '/.netlify/functions/evaluate-writing'

export class EssayEvaluationClientError extends Error {
  constructor(code) {
    super(code)
    this.name = 'EssayEvaluationClientError'
    this.code = code
  }
}

/**
 * Evaluates a Turkish essay through the protected server endpoint.
 * Do not put a provider API key in a VITE_ variable; VITE_ values ship to browsers.
 */
export async function evaluateEssay(userText, taskPrompt, keyPoints, wordCountLimits) {
  const headers = { 'Content-Type': 'application/json' }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      const accessToken = data?.session?.access_token
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`
    } catch {
      throw new EssayEvaluationClientError('UNAUTHORIZED')
    }
  }

  let response
  let responseText
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
  const timeoutId = globalThis.setTimeout(() => controller?.abort(), 45_000)
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userText, taskPrompt, keyPoints, wordCountLimits }),
      ...(controller ? { signal: controller.signal } : {}),
    })
    responseText = await response.text()
  } catch {
    throw new EssayEvaluationClientError('AI_SERVICE_UNAVAILABLE')
  } finally {
    globalThis.clearTimeout(timeoutId)
  }

  if (!response.ok) {
    let errorCode = response.status === 401 || response.status === 403 ? 'AI_AUTH_ERROR' : 'AI_SERVICE_ERROR'
    try {
      const errorPayload = parseJsonResponse(responseText)
      if (errorPayload?.code === 'UNAUTHORIZED') errorCode = 'UNAUTHORIZED'
      else if (errorPayload?.code) errorCode = errorPayload.code
    } catch {
      // Preserve a useful HTTP-status error even when an error body is not JSON.
    }
    throw new EssayEvaluationClientError(errorCode)
  }

  let result
  try {
    // Parse plain JSON as usual, but tolerate a server/AI response wrapped in ```json fences.
    result = parseJsonResponse(responseText)
  } catch {
    throw new EssayEvaluationClientError('AI_INVALID_RESPONSE')
  }

  const score = Number(result?.score)
  if (
    !Number.isInteger(score) || score < 1 || score > 100 ||
    typeof result?.feedback !== 'string' ||
    !Array.isArray(result?.grammar_errors) ||
    !result.grammar_errors.every((item) => typeof item === 'string')
  ) {
    throw new EssayEvaluationClientError('AI_INVALID_RESPONSE')
  }

  return {
    score,
    feedback: result.feedback,
    grammar_errors: result.grammar_errors,
  }
}
