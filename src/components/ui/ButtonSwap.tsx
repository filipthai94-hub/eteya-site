'use client'

import Link from 'next/link'
import s from './ButtonSwap.module.css'

type Variant = 'accent' | 'white' | 'muted'
type Size = 'sm' | 'md' | 'lg'

interface ButtonSwapProps {
  /** The button label — will be split into words for stagger animation */
  label: string
  variant?: Variant
  size?: Size
  arrow?: boolean
  href?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  style?: React.CSSProperties
}

const ArrowIcon = () => (
  <span className={s.arrow}>
    <svg strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  </span>
)

export default function ButtonSwap({
  label,
  variant = 'accent',
  size = 'md',
  arrow = false,
  href,
  onClick,
  className,
  style,
}: ButtonSwapProps) {
  const words = label.split(' ')

  const variantColors: Record<Variant, string> = {
    accent: '#C8FF00',
    white: '#F5F5F5',
    muted: '#9B9B9B',
  }

  const cls = [
    s.btn,
    variant === 'muted' && s.muted,
    variant === 'white' && s.white,
    size !== 'md' && s[size],
    className,
  ].filter(Boolean).join(' ')

  const wordElements = words.map((w, i) => (
    <span key={i} className={s.word}>{w}</span>
  ))

  const content = (
    <>
      <div className={s.textLayer}>
        {wordElements}
        {arrow && <ArrowIcon />}
      </div>
      <div className={s.cloneLayer}>
        {words.map((w, i) => (
          <span key={i} className={s.word}>{w}</span>
        ))}
        {arrow && <ArrowIcon />}
      </div>
    </>
  )

  const mergedStyle = { ...style, color: variantColors[variant] }

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('//')
    if (isExternal) {
      return <a href={href} onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>} className={cls} style={mergedStyle} target="_blank" rel="noopener noreferrer nofollow">{content}</a>
    }
    return <Link href={href} onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>} className={cls} style={mergedStyle}>{content}</Link>
  }

  return (
    <button type="button" className={cls} onClick={onClick} style={mergedStyle}>
      {content}
    </button>
  )
}
