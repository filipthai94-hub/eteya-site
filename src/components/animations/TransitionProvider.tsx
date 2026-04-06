'use client'

import { TransitionRouter } from 'next-transition-router'
import { gsap } from 'gsap'

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  return (
    <TransitionRouter
      auto
      leave={(next) => {
        // Overlay glider IN och täcker sidan
        const tl = gsap.timeline({ onComplete: next })
        tl.set('.page-transition-overlay', { scaleY: 0, transformOrigin: 'top' })
        tl.to('.page-transition-overlay', {
          scaleY: 1,
          duration: 0.5,
          ease: 'expo.inOut',
        })
        return () => tl.kill()
      }}
      enter={(next) => {
        // Sätt ny sida startposition INNAN overlay glider ut
        gsap.set('.page-content', { opacity: 0, y: 24 })

        const tl = gsap.timeline({ onComplete: next })

        // Overlay glider UT
        tl.to('.page-transition-overlay', {
          scaleY: 0,
          duration: 0.55,
          ease: 'expo.inOut',
          transformOrigin: 'bottom',
        })

        // Ny sida glider IN — startar lite innan overlay är klar
        tl.to('.page-content', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        }, '-=0.2')

        return () => tl.kill()
      }}
    >
      {children}
    </TransitionRouter>
  )
}
