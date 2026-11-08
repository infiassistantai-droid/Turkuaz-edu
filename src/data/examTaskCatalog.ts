import { MOCK_01, type MockSkillKey } from './mockDatabase'

export type ExamTaskType = 'headphones' | 'book-open' | 'pen-line' | 'mic'

export type ExamTask = {
  id: string
  category: MockSkillKey
  title: string
  description: string
  type: ExamTaskType
  estimatedTime: string
  estimatedTimeMinutes: number
  xpReward: number
  totalQuestions: number
  route: 'mock'
  section: MockSkillKey
}

const SKILLS: Array<{ key: MockSkillKey; type: ExamTaskType }> = [
  { key: 'dinleme', type: 'headphones' },
  { key: 'okuma', type: 'book-open' },
  { key: 'yazma', type: 'pen-line' },
  { key: 'konusma', type: 'mic' },
]

const EMPTY_CATEGORY_TASKS: Record<MockSkillKey, Array<{ id: string; title: string; description: string; totalQuestions: number }>> = {
  dinleme: [
    { id: 'fallback-listening-announcement', title: 'Kısa duyuru', description: 'Kampüsteki bir etkinlik duyurusunu dinleyin; tarih, saat ve kayıt yeriyle ilgili beş soruyu cevaplayın.', totalQuestions: 5 },
    { id: 'fallback-listening-dialogue', title: 'Randevu diyaloğu', description: 'İki kişinin randevu saatini değiştirme konuşmasını dinleyin ve önemli ayrıntıları belirleyin.', totalQuestions: 5 },
    { id: 'fallback-listening-news', title: 'Radyo haberi', description: 'Şehir yaşamıyla ilgili kısa bir haberi dinleyin; ana fikir ve neden-sonuç ilişkilerini bulun.', totalQuestions: 5 },
  ],
  okuma: [
    { id: 'fallback-reading-notice', title: 'Kütüphane ilanı', description: 'Kütüphanenin çalışma saatleri ve üyelik kuralları hakkındaki ilanı okuyup beş soruyu cevaplayın.', totalQuestions: 5 },
    { id: 'fallback-reading-main-idea', title: 'Paragrafın ana fikri', description: 'Eğitim ve günlük yaşam konulu kısa metni okuyun; ana düşünceyi ve destekleyici bilgileri seçin.', totalQuestions: 5 },
    { id: 'fallback-reading-inference', title: 'Metinden çıkarım', description: 'Bir gezi yazısını okuyun; Doğru, Yanlış veya Metinde Yok türündeki ifadeleri değerlendirin.', totalQuestions: 5 },
  ],
  yazma: [
    { id: 'fallback-writing-email', title: 'Arkadaşa e-posta', description: 'Bir etkinliğe davet edildiğiniz arkadaşınıza uygun bir yanıt e-postası yazın.', totalQuestions: 1 },
    { id: 'fallback-writing-request', title: 'Resmî başvuru mektubu', description: 'Bir kurumdan bilgi ve destek istemek için nazik, açık bir başvuru mektubu hazırlayın.', totalQuestions: 1 },
    { id: 'fallback-writing-opinion', title: 'Görüş yazısı', description: 'Toplu taşımanın şehir yaşamına etkisi hakkında görüşünüzü gerekçeler ve örneklerle savunun.', totalQuestions: 1 },
  ],
  konusma: [
    { id: 'fallback-speaking-intro', title: 'Kendinizi tanıtın', description: 'Eğitiminiz, günlük yaşamınız ve Türkçe öğrenme hedefleriniz hakkında konuşun.', totalQuestions: 1 },
    { id: 'fallback-speaking-memory', title: 'Unutulmaz bir deneyim', description: 'Yaşadığınız bir yolculuğu anlatın; hazırlık, karşılaştığınız durum ve öğrendiklerinizi açıklayın.', totalQuestions: 1 },
    { id: 'fallback-speaking-opinion', title: 'Bir konuda görüş bildirin', description: 'Dijital öğrenmenin yararlarını ve zorluklarını örneklerle değerlendirip kendi fikrinizi savunun.', totalQuestions: 1 },
  ],
}

function distributeMinutes(totalMinutes: number, itemCount: number, itemIndex: number) {
  if (itemCount <= 0) return 0
  const base = Math.floor(totalMinutes / itemCount)
  const remainder = totalMinutes % itemCount
  return Math.max(1, base + (itemIndex < remainder ? 1 : 0))
}

function getSectionItems(skill: MockSkillKey) {
  const section = MOCK_01.sections[skill]
  if (skill === 'dinleme' || skill === 'okuma') {
    const items = section.parts.map((part) => ({
      id: part.id,
      title: part.title,
      description: part.instructions || part.contextTitle || part.questions[0]?.prompt || section.label,
      totalQuestions: part.questions.length,
    }))
    return items.length ? items : EMPTY_CATEGORY_TASKS[skill].map((item) => ({ ...item }))
  }
  if (skill === 'yazma') {
    const items = section.tasks.slice(0, 5).map((task) => ({
      id: task.id,
      title: task.title,
      description: task.prompt,
      totalQuestions: 1,
    }))
    return items.length ? items : EMPTY_CATEGORY_TASKS[skill].map((item) => ({ ...item }))
  }
  const items = section.parts.slice(0, 5).map((part) => ({
    id: part.id,
    title: part.title,
    description: part.prompt,
    totalQuestions: 1,
  }))
  return items.length ? items : EMPTY_CATEGORY_TASKS[skill].map((item) => ({ ...item }))
}

export const EXAM_TASK_CATALOG: Record<MockSkillKey, ExamTask[]> = Object.fromEntries(
  SKILLS.map(({ key, type }) => {
    const section = MOCK_01.sections[key]
    const items = getSectionItems(key)
    return [key, items.map((item, index) => {
      const estimatedTimeMinutes = distributeMinutes(section.durationMinutes, items.length, index)
      return {
        ...item,
        id: `${MOCK_01.id}-${item.id}`,
        category: key,
        type,
        estimatedTime: `${estimatedTimeMinutes} daq`,
        estimatedTimeMinutes,
        // Section previews don't award XP alone. The existing full-exam rules
        // award XP only after the qualifying full mock is actually completed.
        xpReward: 0,
        route: 'mock' as const,
        section: key,
      }
    })]
  }),
) as Record<MockSkillKey, ExamTask[]>

export const EXAM_TASK_CATEGORIES: Array<{ id: MockSkillKey; titleKey: string; icon: ExamTaskType }> = [
  { id: 'dinleme', titleKey: 'examsHub.category.listening', icon: 'headphones' },
  { id: 'okuma', titleKey: 'examsHub.category.reading', icon: 'book-open' },
  { id: 'yazma', titleKey: 'examsHub.category.writing', icon: 'pen-line' },
  { id: 'konusma', titleKey: 'examsHub.category.speaking', icon: 'mic' },
]
