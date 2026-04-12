'use client'

import { cn } from '@/lib/utils'

type SpotlightProps = {
  className?: string
  fill?: string
}

export function Spotlight({
  className = '',
  fill = 'white',
}: SpotlightProps) {
  return (
    <div
      className={cn(
        'absolute top-1/2 left-1/2',
        'h-[800px] w-[800px] rounded-full',
        'bg-white/[0.05]',
        'blur-[120px]',
        'animate-spotlight',
        className
      )}
      style={{
        background: `radial-gradient(circle, ${fill} 0%, transparent 60%)`,
      }}
    />
  )
}
