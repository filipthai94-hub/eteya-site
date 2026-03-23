'use client'
import { m, useReducedMotion } from 'motion/react'

export default function SplitText({ text, className }: { text: string; className?: string }) {
  const shouldReduce = useReducedMotion()
  const words = text.split(' ')

  return (
    <m.span
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className ?? ''}`}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
      initial="hidden"
      animate="show"
    >
      {words.map((w, i) => (
        <m.span key={i} className="overflow-hidden inline-block">
          <m.span
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: shouldReduce ? 0 : 50 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
            }}
          >
            {w}
          </m.span>
        </m.span>
      ))}
    </m.span>
  )
}
