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
    const originalHtmlStyle = document.documentElement.style.overflow

    // Lock scroll
    targetEl.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // iOS Safari fix
    const originalIOS = (targetEl.style as any).webkitOverflowScrolling
    ;(targetEl.style as any).webkitOverflowScrolling = 'hidden'

    return () => {
      // Restore original styles
      targetEl.style.overflow = originalStyle
      document.documentElement.style.overflow = originalHtmlStyle
      ;(targetEl.style as any).webkitOverflowScrolling = originalIOS
    }
  }, [lockTarget, autoLock])

  return {
    isLocked: true,
  }
}
