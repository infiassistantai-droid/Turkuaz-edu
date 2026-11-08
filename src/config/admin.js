// Replace this placeholder with the exact email used by the Supabase owner account.
export const OWNER_EMAIL = 'your_email@gmail.com'

const PLACEHOLDER_OWNER_EMAIL = 'your_email@gmail.com'

export function isOwnerEmail(email) {
  const ownerEmail = String(OWNER_EMAIL || '').trim().toLocaleLowerCase('en-US')
  const candidate = String(email || '').trim().toLocaleLowerCase('en-US')
  return ownerEmail !== PLACEHOLDER_OWNER_EMAIL && Boolean(candidate) && candidate === ownerEmail
}
