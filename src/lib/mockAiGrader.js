// Deterministic client-side rubric demo. This is NOT an AI service and sends no text to a server.
const clamp = (value, min, max) => Math.max(min, Math.min(max, Math.round(value)))

export async function gradeTextMock(text, { kind = 'writing' } = {}) {
  const source = String(text || '').trim()
  await new Promise((resolve) => setTimeout(resolve, 900))
  const words = source.split(/\s+/).filter(Boolean)
  const lower = source.toLocaleLowerCase('tr-TR')
  const connectorCount = ['çünkü', 'ancak', 'bunun yanı sıra', 'sonuç olarak', 'dolayısıyla', 'öncelikle'].filter((phrase) => lower.includes(phrase)).length
  const sentenceCount = source.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 2).length
  const average = clamp(25 + Math.min(30, words.length * 0.55) + Math.min(15, sentenceCount * 3) + Math.min(12, connectorCount * 4), 20, 92)
  const rubric = {
    task: clamp(average + (words.length >= 35 ? 4 : -6), 15, 98),
    grammar: clamp(average - (/[a-z][A-Z]|\s{2,}/.test(source) ? 12 : 3), 15, 98),
    vocabulary: clamp(average + Math.min(10, new Set(words.map((word) => word.toLocaleLowerCase('tr-TR'))).size / 4), 15, 98),
    coherence: clamp(average + Math.min(8, connectorCount * 2) - (sentenceCount < 2 ? 8 : 0), 15, 98),
  }
  const score = Math.round(Object.values(rubric).reduce((sum, value) => sum + value, 0) / 4)
  const level = score >= 78 ? 'C1' : score >= 58 ? 'B2' : score >= 38 ? 'B1' : 'A2'
  const corrections = []
  if (/[a-z][A-Z]/.test(source)) corrections.push({ original: 'Sentence capitalization', suggestion: 'Her cümleye büyük harfle başlayın.' })
  if (!/[.!?]$/.test(source)) corrections.push({ original: source.slice(-40) || '—', suggestion: 'Yanıtın sonuna uygun bir noktalama işareti ekleyin.' })
  if (words.length < 35) corrections.push({ original: `${words.length} words`, suggestion: 'Yanıtınızı ilgili örnekler ve destekleyici ayrıntılarla geliştirin.' })
  const xp = Math.round(score * (kind === 'speaking' ? 0.45 : 0.5))
  return { kind, score, level, rubric, corrections, wordCount: words.length, xp, isMock: true }
}
