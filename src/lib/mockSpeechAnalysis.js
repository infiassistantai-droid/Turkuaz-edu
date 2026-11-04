// Demo-only pronunciation feedback. Media is recorded locally and is never uploaded or truly analyzed.
export async function analyzeAudioMock(sentence, audioBlob) {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const words = String(sentence || '').trim().split(/\s+/u)
  const targetIndex = words.findIndex((word) => /istanbul/i.test(word))
  const errorIndex = targetIndex >= 0 ? targetIndex : Math.min(words.length - 1, Math.max(0, Math.floor(words.length * 0.65)))
  const problemWord = (words[errorIndex] || '').replace(/[.,!?;:]+$/u, '')
  const advice = targetIndex >= 0
    ? "İpucu: 'İstanbul'a' kelimesindeki kesme işaretinden sonraki kısmı daha yumuşak bağlamalısın."
    : `İpucu: “${problemWord}” kelimesini daha yavaş ve net söyleyerek heceleri birbirine yumuşakça bağlamaya çalış.`
  return {
    score: 85,
    transcript: words.map((word, index) => ({ word, status: index === errorIndex ? 'mispronounced' : 'correct' })),
    advice,
    durationBytes: audioBlob?.size || 0,
    isMock: true,
  }
}
