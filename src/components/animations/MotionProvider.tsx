'use client'
import SmoothScroll from './SmoothScroll'

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>
}
