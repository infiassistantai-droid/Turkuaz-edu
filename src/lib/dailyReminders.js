const PREF_KEY = 'turkuaz-edu-daily-reminders'
const LAST_SHOWN_KEY = 'turkuaz-edu-reminder-last-shown'

export const getReminderPreference = () => {
  try { return window.localStorage.getItem(PREF_KEY) === 'true' } catch { return false }
}

export async function enableDailyReminder() {
  if (!('Notification' in window)) throw new Error('notifications-unavailable')
  const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('notifications-denied')
  try { window.localStorage.setItem(PREF_KEY, 'true') } catch { /* preference remains in-memory */ }
  return true
}

export function disableDailyReminder() {
  try { window.localStorage.setItem(PREF_KEY, 'false') } catch { /* ignore storage restrictions */ }
}

// Web notifications cannot be scheduled reliably while a browser is closed without a push server.
// This displays at most one daily reminder each time the learner opens the app.
export async function showDailyReminderIfDue(copy = {}) {
  if (!getReminderPreference() || !('Notification' in window) || Notification.permission !== 'granted') return
  const today = new Date().toLocaleDateString('en-CA')
  try { if (window.localStorage.getItem(LAST_SHOWN_KEY) === today) return } catch { /* continue */ }
  try {
    const registration = await navigator.serviceWorker?.ready
    const options = { body: copy.body || 'A short Turkish practice session keeps your learning streak going.', icon: '/icons/turkish-education.svg', tag: `daily-practice-${today}` }
    const title = copy.title || 'Turkuaz Edu · Daily practice'
    if (registration?.showNotification) await registration.showNotification(title, options)
    else new Notification(title, options)
    try { window.localStorage.setItem(LAST_SHOWN_KEY, today) } catch { /* ignore */ }
  } catch { /* unsupported or blocked notification contexts */ }
}
