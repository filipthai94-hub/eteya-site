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
    
    // Lock body with position: fixed
    targetEl.style.position = 'fixed'
    targetEl.style.top = `-${scrollY}px`
    targetEl.style.left = '0'
    targetEl.style.right = '0'
    targetEl.style.width = '100%'

    return () => {
      // Restore body
      targetEl.style.position = ''
      targetEl.style.top = ''
      targetEl.style.left = ''
      targetEl.style.right = ''
      targetEl.style.width = ''
      
      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }, [lockTarget, autoLock])

  return {
    isLocked: true,
  }
}
