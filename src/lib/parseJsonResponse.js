function stripMarkdownCodeFence(value) {
  const source = String(value ?? '').replace(/^\uFEFF/u, '').trim()
  const fencedBlock = source.match(/```\s*(?:json)?\s*([\s\S]*?)\s*```/iu)
  if (fencedBlock) return fencedBlock[1].trim()

  return source
    .replace(/^```\s*(?:json)?\s*/iu, '')
    .replace(/\s*```$/u, '')
    .trim()
}

function findJsonObject(source) {
  const start = source.indexOf('{')
  if (start < 0) return ''

  let depth = 0
  let inString = false
  let escaped = false
  for (let index = start; index < source.length; index += 1) {
    const character = source[index]
    if (inString) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === '"') inString = false
      continue
    }
    if (character === '"') inString = true
    else if (character === '{') depth += 1
    else if (character === '}') {
      depth -= 1
      if (depth === 0) return source.slice(start, index + 1)
    }
  }
  return ''
}

/** Parse JSON from plain text or a Markdown-fenced AI response without inventing fallback data. */
export function parseJsonResponse(value) {
  const cleaned = stripMarkdownCodeFence(value)
  const candidate = findJsonObject(cleaned)
  const candidates = [cleaned, candidate].filter((item, index, all) => item && all.indexOf(item) === index)

  for (const text of candidates) {
    try {
      return JSON.parse(text)
    } catch {
      // Try the extracted JSON object if the response also contains surrounding prose.
    }
  }

  throw new SyntaxError('The response did not contain a valid JSON object.')
}
