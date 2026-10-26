// Shared utility functions for the Türkçe Marathon application

/** Join class names, skipping falsy values */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/** Zero-pad to two digits */
export function pad(n) {
  return String(n).padStart(2, '0')
}

/** Format total seconds as m:ss */
export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${pad(m)}:${pad(s)}`
}

/**
 * Estimate a CEFR level (B1/B2/C1) from a 0-100 mock exam score,
 * aligned with Milliy Sertifikat banding.
 */
export function cefrFromScore(score) {
  if (score >= 90) {
    return {
      level: 'C1',
      message: 'Ajoyib! Milliy Sertifikat C1 darajasiga tayyorsiz — kuchli azorasi boksangiz!',
      tone: 'turk',
    }
  }
  if (score >= 75) {
    return {
      level: 'C1',
      message: 'C1 yoʻnalishida mustahkam poydevor — ozgina muntazamlik bilan C1 sertifikatini qoʻlga kiritasiz.',
      tone: 'turk',
    }
  }
  if (score >= 60) {
    return {
      level: 'B2',
      message: 'Milliy Sertifikat B2 darajasida — B2 topshirishiga tayyorsiz. Qaytarilgan savollar ustida ishlang.',
      tone: 'amber',
    }
  }
  if (score >= 45) {
    return {
      level: 'B1',
      message: 'B1 darajasi aniq koʻrinmoqda — B2 yoʻnalishida koʻproq trening kerak.',
      tone: 'amber',
    }
  }
  return {
    level: 'B1',
    message: 'B1 darajasiga yetish uchun asosiy qoidalarni qayta oʻrganish va har kuni trening qilish tavsiya etiladi.',
    tone: 'rose',
  }
}

/**
 * Simulated AI rubric grading for writing tasks.
 * Uses length fit, Turkish special characters, sentence structure and
 * common connector words to produce a deterministic 30-96 score.
 */
export function gradeWriting(text, targetWords) {
  const trimmed = text.trim()
  if (trimmed.length < 20) {
    return null
  }
  const words = trimmed.split(/\s+/).filter(Boolean)
  const wc = words.length
  const turkChars = (trimmed.match(/[çğıöşüÇĞİÖŞÜİ]/g) || []).length
  const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 2).length
  const kw = ['ben', 'siz', 'için', 'ile', 'ama', 'çok', 'güzel', 'olarak', 'ne', 'kadar', 'her', 've', 'diye', 'bence']
  const found = kw.filter(k => trimmed.toLowerCase().includes(k))

  let score = Math.round(32 + Math.min(45, wc * 0.4) + (turkChars > 0 ? 7 : 0) + Math.min(10, found.length * 2))
  if (wc < 25) score -= 6
  if (wc > 185) score -= Math.min(10, (wc - 185) * 0.3)
  if (sentences < 3) score -= 5
  score = Math.max(30, Math.min(96, score))

  const level = score >= 80 ? 'B2' : score >= 60 ? 'B1' : 'A2'

  let message = ''
  if (score >= 85) message = 'Ajoyib! B2 darajasidagi malakasiz — Milliy Sertifikat B2 topshirishiga tayyorsiz.'
  else if (score >= 70) message = 'Yaxshi natija! B2 yoʻnalishida ozgina ishlaydigan boʻlsangiz, bu qadar yiqilmaydi.'
  else if (score >= 55) message = 'Aniq darajaga yaqin — hajm va iboralar ustida ishlash koʻproq foyda beradi.'
  else message = 'Yana koʻproq matn yozish va turkcha iboralarni oʻrganish kerak. Bu faqat boshlanishi!'

  const bullets = []
  const [lo, hi] = targetWords.split('–').map(Number)
  if (wc < lo) bullets.push(`<b>Hajm:</b> ${wc} soʻz — tavsiya etilgan ${targetWords} soʻzga yetish uchun fikrlarni rad etish qoʻshing.`)
  else if (wc > hi + 20) bullets.push(`<b>Hajm:</b> ${wc} soʻz — juda uzun. Asosiy fikrga eʼtibor bering, keraksiz qismlarni olib tashlang.`)
  else bullets.push(`<b>Hajm:</b> ${wc} soʻz — talabga mos, mumkin. ✓`)

  bullets.push(
    turkChars > 0
      ? `<b>Lugʻat:</b> Türk tiliga xos harflardan (ç, ğ, ı, ö, ş, ü) foydalandingiz — ${turkChars} marta ✓`
      : '<b>Lugʻat:</b> Türk tiliga xos harflardan (ç, ğ, ı, ö, ş, ü) foydalaning — bu matnni asliroq koʻrsatadi.',
  )

  bullets.push(
    `<b>Gramatika:</b> ${sentences >= 4 ? `${sentences} ta gap — cümle qurımı yaxshi.` : `${sentences} ta gap — cümle sonini oshirish tavsiya etiladi.`}`,
  )

  bullets.push(
    found.length >= 6
      ? `<b>Soʻzlar:</b> Mashhur soʻzlardan foydalandingiz: ${found.slice(0, 5).join(', ')}.`
      : '<b>Soʻzlar:</b> Koʻproq xizmat soʻzlari va iboralardan (için, ile, ama, dolayı) foydalaning.',
  )

  return { score, level, message, bullets, wc, turkChars, sentences }
}

/**
 * Turkish suffix playground engine.
 * Builds the correct surface form for a base word + suffix using
 * vowel harmony, rounding, voicing (soyutlama) and buffer rules.
 */
const BACK = ['a', 'ı', 'o', 'u']
const BACK_ROUND = ['o', 'u']
const FRONT = ['e', 'i', 'ö', 'ü']
const FRONT_ROUND = ['ö', 'ü']

export function lastVowelOf(word) {
  const found = word.match(/[aeıioöuü]/gi) || []
  return found.length ? found[found.length - 1].toLowerCase() : 'e'
}

export function isBackVowel(v) {
  return BACK.includes(v)
}

/** Soyutlama: p,k,ç,ş,t voice before vowel-initial suffixes */
export function voiceBase(word) {
  const last = word.slice(-1).toLowerCase()
  if (last === 'p') return word.slice(0, -1) + 'b'
  if (last === 'k') return word.slice(0, -1) + 'ğ'
  if (last === 'ç') return word.slice(0, -1) + 'c'
  if (last === 'ş') return word.slice(0, -1) + 's'
  if (last === 't') return word.slice(0, -1) + 'd'
  return word
}

export function harmonyVowel(v) {
  if (isBackVowel(v)) return BACK_ROUND.includes(v) ? 'u' : 'ı'
  return FRONT_ROUND.includes(v) ? 'ü' : 'i'
}

export function buildSuffix(word, suffixId) {
  const v = lastVowelOf(word)
  const endsVowel = /[aeıioöuü]$/i.test(word)
  const last = word.slice(-1).toLowerCase()
  let form = ''
  let rule = ''

  if (suffixId === 'plural') {
    const suf = isBackVowel(v) ? 'lar' : 'ler'
    form = word + suf
    rule = `Soʻz oxiridagi unli <b>${v}</b> ${isBackVowel(v) ? 'katta/orqa' : 'kichik/old'} unli → <b>-${suf}</b> qoʻshiladi.`
  } else if (suffixId === 'p1') {
    if (endsVowel) {
      form = v === 'e' ? word + 'im' : word + 'm'
      rule = `Soʻz unli bilan tugagan — <b>-(i)m</b> qoʻshimchasi qoʻshiladi${v === 'e' ? ' (e ortidan i keladi: ev → evim)' : ''}.`
    } else {
      const w2 = voiceBase(word)
      const vow = harmonyVowel(v)
      form = w2 + vow + 'm'
      rule = `Soʻz undosh bilan tugagan: sesshörünleştirme (${last} → ${w2.slice(-1)}) va unli moslashuvi <b>-${vow}m</b>.`
    }
  } else if (suffixId === 'dat') {
    if (endsVowel) {
      if (v === 'e') {
        form = word + 'e'
        rule = "Soʻz unli <b>'e'</b> bilan tugagan — <b>-e</b> (ysiz)."
      } else {
        form = word + 'y' + (isBackVowel(v) ? 'a' : 'e')
        rule = `Soʻz unli <b>${v}</b> bilan tugagan — <b>-(y)a / -(y)e</b> qoʻshimchasi (y bilan).`
      }
    } else {
      const w2 = voiceBase(word)
      form = w2 + (isBackVowel(v) ? 'a' : 'e')
      rule = `Soʻz undosh bilan tugagan: sesshörünleştirme + <b>-${isBackVowel(v) ? 'a' : 'e'}</b>.`
    }
  } else if (suffixId === 'loc') {
    if (endsVowel) {
      const penult = word.slice(-2, -1).toLowerCase()
      if (penult === 'ç') {
        // ç-final vowel stem: y-buffer merges — maça → maçada
        form = word + (isBackVowel(v) ? 'da' : 'de')
        rule = `Soʻz <b>ç</b> bilan tugagan — sesshörünleştirme, <b>-${isBackVowel(v) ? 'da' : 'de'}</b> qoʻshiladi (y buffer toʻqtadi).`
      } else {
        // vowel-final stems take the y-buffer: araba → arabayda
        form = word + 'y' + (isBackVowel(v) ? 'da' : 'de')
        rule = `Soʻz unli bilan tugagan — <b>-(y)a / -(y)e</b> (y buffer) qoʻshiladi: ${word} → <b>${form}</b>.`
      }
    } else if (['p', 'k', 'ç', 'ş', 't'].includes(last)) {
      form = word + (isBackVowel(v) ? 'ta' : 'te')
      rule = `Soʻz p/k/ç/ş/t bilan tugagan — lokativ <b>-${isBackVowel(v) ? 'ta' : 'te'}</b> shaklida.`
    } else {
      form = word + (isBackVowel(v) ? 'da' : 'de')
      rule = `Soʻz boshqa undosh bilan tugagan — <b>-${isBackVowel(v) ? 'da' : 'de'}</b>.`
    }
  } else if (suffixId === 'abl') {
    if (endsVowel) {
      form = word + (isBackVowel(v) ? 'dan' : 'den')
      rule = `Soʻz unli bilan tugagan — <b>-${isBackVowel(v) ? 'dan' : 'den'}</b> qoʻshimchasi toʻgʻridan-toʻgʻri qoʻshiladi.`
    } else if (['p', 'k', 'ç', 'ş', 't'].includes(last)) {
      form = word + (isBackVowel(v) ? 'tan' : 'ten')
      rule = `Soʻz p/k/ç/ş/t bilan tugagan — manba <b>-${isBackVowel(v) ? 'tan' : 'ten'}</b> shaklida.`
    } else {
      form = word + (isBackVowel(v) ? 'dan' : 'den')
      rule = `Soʻz boshqa undosh bilan tugagan — <b>-${isBackVowel(v) ? 'dan' : 'den'}</b>.`
    }
  } else if (suffixId === 'gen') {
    if (endsVowel) {
      const vow = harmonyVowel(v)
      form = word + 'n' + vow + 'n'
      rule = `Soʻz unli bilan tugagan — ichki <b>-n + ${vow} + n</b> (buffer -n- va suffix n).`
    } else {
      const w2 = voiceBase(word)
      const vow = harmonyVowel(v)
      form = w2 + vow + 'n'
      rule = `Soʻz undosh bilan tugagan: sesshörünleştirme (${last} → ${w2.slice(-1)}) va unli moslashuvi <b>-${vow}n</b>.`
    }
  }
  return { form, rule }
}
