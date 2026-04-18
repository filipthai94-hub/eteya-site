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
    const scrollY = window.scrollY
    const originalStyle = {
      overflow: targetEl.style.overflow,
      position: targetEl.style.position,
      top: targetEl.style.top,
      width: targetEl.style.width,
    }
    const originalHtmlStyle = document.documentElement.style.overflow

    // Lock scroll using position: fixed (most robust method)
    targetEl.style.position = 'fixed'
    targetEl.style.top = `-${scrollY}px`
    targetEl.style.width = '100%'
    targetEl.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // iOS Safari fix
    const originalIOS = (targetEl.style as any).webkitOverflowScrolling
    ;(targetEl.style as any).webkitOverflowScrolling = 'hidden'

    return () => {
      // Restore original styles
      targetEl.style.overflow = originalStyle.overflow
      targetEl.style.position = originalStyle.position
      targetEl.style.top = originalStyle.top
      targetEl.style.width = originalStyle.width
      document.documentElement.style.overflow = originalHtmlStyle
      ;(targetEl.style as any).webkitOverflowScrolling = originalIOS
      
      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }, [lockTarget, autoLock])

  return {
    isLocked: true,
  }
}
