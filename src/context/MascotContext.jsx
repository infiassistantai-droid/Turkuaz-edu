import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const noop = () => {}
const EMPTY_MASCOT_CONTEXT = Object.freeze({
  message: '',
  emotion: 'idle',
  visible: false,
  id: 0,
  showMascot: noop,
  hideMascot: noop,
})
const MascotContext = createContext(EMPTY_MASCOT_CONTEXT)
const DEFAULT_DURATION = 3600
const EMOTIONS = new Set(['idle', 'cheer', 'sad', 'focus', 'hint', 'speed'])

function normalizeEmotion(value) {
  const emotion = typeof value === 'string' ? value.toLowerCase() : 'cheer'
  if (emotion === 'success' || emotion === 'win') return 'cheer'
  if (emotion === 'error' || emotion === 'encourage') return 'sad'
  if (emotion === 'reading' || emotion === 'lesson') return 'focus'
  return EMOTIONS.has(emotion) ? emotion : 'cheer'
}

export function MascotProvider({ children }) {
  const [mascot, setMascot] = useState({ message: '', emotion: 'idle', visible: false, id: 0 })
  const timerRef = useRef(null)
  const nextIdRef = useRef(0)

  const clearTimer = () => {
    if (timerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(timerRef.current)
    }
    timerRef.current = null
  }

  const hideMascot = useCallback(() => {
    clearTimer()
    setMascot((current) => ({ ...current, message: '', emotion: 'idle', visible: false }))
  }, [])

  const showMascot = useCallback((payload = {}) => {
    const options = payload && typeof payload === 'object' ? payload : {}
    const text = typeof options.message === 'string' ? options.message.trim() : ''
    if (!text) return

    clearTimer()
    const id = ++nextIdRef.current
    setMascot({ message: text, emotion: normalizeEmotion(options.emotion), visible: true, id })

    let timeout = DEFAULT_DURATION
    if (options.duration !== undefined) {
      try {
        timeout = Number(options.duration)
      } catch {
        timeout = DEFAULT_DURATION
      }
    }
    if (Number.isFinite(timeout) && timeout > 0 && typeof window !== 'undefined') {
      const timerId = window.setTimeout(() => {
        setMascot((current) => current.id === id
          ? { ...current, message: '', emotion: 'idle', visible: false }
          : current)
        if (timerRef.current === timerId) timerRef.current = null
      }, timeout)
      timerRef.current = timerId
    }
  }, [])

  useEffect(() => () => clearTimer(), [])

  const value = useMemo(() => ({ ...mascot, showMascot, hideMascot }), [mascot, showMascot, hideMascot])

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>
}

export function useMascot() {
  return useContext(MascotContext) || EMPTY_MASCOT_CONTEXT
}
