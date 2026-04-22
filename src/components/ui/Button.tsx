'use client'

import Link from 'next/link'
import s from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'small'

interface ButtonProps {
  variant?: ButtonVariant
  href?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  fullWidth?: boolean
  style?: React.CSSProperties
}

export default function Button({
  variant = 'primary',
  href,
  onClick,
  children,
  className,
  type = 'button',
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  // Ghost uses a flat element (no outer+inner structure)
  if (variant === 'ghost') {
    const cls = [
      s.ghost,
      disabled && s.disabled,
      className,
    ].filter(Boolean).join(' ')

    if (href) {
      const isExternal = href.startsWith('http') || href.startsWith('//')
      if (isExternal) {
        return (
          <a href={href} className={cls} style={style} target="_blank" rel="noopener noreferrer nofollow">
            {children}
          </a>
        )
      }
      return (
        <Link href={href} className={cls} style={style}>
          {children}
        </Link>
      )
    }

    return (
      <button type={type} disabled={disabled} className={cls} onClick={onClick} style={style}>
        {children}
      </button>
    )
  }

  // Primary / Secondary / Small — outer glow wrapper + inner glass body
  const outerCls = [
    s.btn,
    variant === 'secondary' && s.secondary,
    variant === 'small' && s.small,
    disabled && s.disabled,
    fullWidth && s.fullWidth,
    className,
  ].filter(Boolean).join(' ')

  const content = <span className={s.inner}>{children}</span>

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('//')
    if (isExternal) {
      return (
        <a href={href} className={outerCls} style={style} target="_blank" rel="noopener noreferrer nofollow">
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={outerCls} style={style}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} className={outerCls} onClick={onClick} style={style}>
      {content}
    </button>
  )
}
