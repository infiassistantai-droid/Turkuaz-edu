import { useWinterUpdate } from './WinterUpdateContext'

const SNOW_PARTICLES = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 11) % 100}%`,
  delay: `${-((index * 13) % 24)}s`,
  duration: `${18 + ((index * 7) % 17)}s`,
  size: `${7 + ((index * 5) % 8)}px`,
  drift: `${((index * 19) % 90) - 45}px`,
  opacity: 0.28 + ((index * 11) % 28) / 100,
}))

export default function WinterEffects() {
  const { enabled } = useWinterUpdate()
  if (!enabled) return null

  return (
    <div className="winter-atmosphere pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <div className="winter-frost-glow absolute inset-0" />
      {SNOW_PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="winter-snowflake absolute -top-8 select-none text-sky-100"
          style={{
            left: particle.left,
            fontSize: particle.size,
            opacity: particle.opacity,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            '--winter-drift': particle.drift,
          }}
        >
          {particle.id % 3 === 0 ? '✦' : '❄'}
        </span>
      ))}
    </div>
  )
}
