'use client'

import Link from 'next/link'
import s from './ButtonStripe.module.css'

type Variant = 'primary' | 'secondary' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonStripeProps {
  variant?: Variant
  size?: Size
  href?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  style?: React.CSSProperties
}

export default function ButtonStripe({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  children,
  className,
  type = 'button',
  disabled = false,
  fullWidth = false,
  style,
}: ButtonStripeProps) {
  const cls = [
    s.btn,
    variant !== 'primary' && s[variant],
    size !== 'md' && s[size],
    disabled && s.disabled,
    fullWidth && s.fullWidth,
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <>
      <span className={`${s.stripe} ${s.s1}`} />
      <span className={`${s.stripe} ${s.s2}`} />
      <span className={`${s.stripe} ${s.s3}`} />
      <span className={`${s.stripe} ${s.s4}`} />
      <span className={s.text}>{children}</span>
    </>
  )

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('//')
    if (isExternal) {
      return <a href={href} className={cls} style={style} target="_blank" rel="noopener noreferrer">{content}</a>
    }
    return <Link href={href} className={cls} style={style}>{content}</Link>
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cls}
      onClick={onClick}
      style={style}
    >
      {content}
    </button>
  )
}
