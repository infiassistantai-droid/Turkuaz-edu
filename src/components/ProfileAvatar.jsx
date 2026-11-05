import { useEffect, useState } from 'react'
import { getInitials } from '../lib/storage'
import { cn } from '../lib/utils'

export default function ProfileAvatar({ profile, sizeClass = 'size-9', className, initialsClassName, alt, fallbackText }) {
  const avatarUrl = profile?.avatarUrl || profile?.avatar_url || ''
  const [imageFailed, setImageFailed] = useState(false)
  const initials = fallbackText || (profile ? getInitials(profile.name, profile.surname) : 'TU')

  useEffect(() => setImageFailed(false), [avatarUrl])

  return (
    <span className={cn('relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-xs font-bold text-white', sizeClass, className)}>
      {avatarUrl && !imageFailed ? (
        <img
          src={avatarUrl}
          alt={alt || `${[profile?.name, profile?.surname].filter(Boolean).join(' ') || 'Learner'} profile photo`}
          className="absolute inset-0 size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className={initialsClassName}>{initials}</span>
      )}
    </span>
  )
}
