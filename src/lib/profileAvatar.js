export const CLASSIC_AVATAR_PATHS = Object.freeze([
  '/images/avatars/avatar-1.png',
  '/images/avatars/avatar-2.png',
  '/images/avatars/avatar-3.png',
  '/images/avatars/avatar-4.png',
  '/images/avatars/avatar-5.png',
  '/images/avatars/avatar-6.png',
])

export const PORTRAIT_AVATAR_PATHS = Object.freeze(Array.from(
  { length: 8 },
  (_, index) => `/images/avatars/portrait-${index + 1}.jpg`,
))

export const PRESET_AVATAR_PATHS = Object.freeze([...CLASSIC_AVATAR_PATHS, ...PORTRAIT_AVATAR_PATHS])

export function isPresetAvatarPath(value) {
  return PRESET_AVATAR_PATHS.includes(String(value || ''))
}
