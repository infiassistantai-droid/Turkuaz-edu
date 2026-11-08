export const PRESET_AVATAR_PATHS = Object.freeze([
  '/images/avatars/avatar-1.png',
  '/images/avatars/avatar-2.png',
  '/images/avatars/avatar-3.png',
  '/images/avatars/avatar-4.png',
  '/images/avatars/avatar-5.png',
  '/images/avatars/avatar-6.png',
])

export function isPresetAvatarPath(value) {
  return PRESET_AVATAR_PATHS.includes(String(value || ''))
}
