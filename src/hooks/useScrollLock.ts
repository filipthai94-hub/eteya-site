import { useLayoutEffect } from 'react'

interface UseScrollLockOptions {
  lockTarget?: string | HTMLElement | null
  autoLock?: boolean
}

export function useScrollLock(options: UseScrollLockOptions = {}) {
  const { lockTarget = 'body', autoLock = true } = options

  useLayoutEffect(() => {
    if (!autoLock) return

    const target = typeof lockTarget === 'string'
      ? document.querySelector(lockTarget)
      : lockTarget

    if (!target) return

    const targetEl = target as HTMLElement
    const originalStyle = targetEl.style.overflow

    // Lock scroll with overflow: hidden (compatible with modal scroll)
    targetEl.style.overflow = 'hidden'

    return () => {
      // Restore original style
      targetEl.style.overflow = originalStyle
    }
  }, [lockTarget, autoLock])

  return {
    isLocked: true,
  }
}
