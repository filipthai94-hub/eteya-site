'use client'

import { useState } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'default' | 'sm'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  style?: React.CSSProperties
}

const BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 0,
  fontFamily: 'var(--font-body), "Geist", sans-serif',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  transition: 'background .4s cubic-bezier(.165,.84,.44,1), border-color .4s cubic-bezier(.165,.84,.44,1), transform .4s cubic-bezier(.165,.84,.44,1), color .4s cubic-bezier(.165,.84,.44,1)',
}

function getSize(size: ButtonSize): React.CSSProperties {
  if (size === 'sm') return { padding: '0 16px', height: 40 }
  return { padding: '16px 24px', height: 48 }
}

function getVariantStyles(variant: ButtonVariant, hovered: boolean): React.CSSProperties {
  if (variant === 'secondary') {
    return {
      background: 'transparent',
      color: '#FFFFFF',
      border: hovered ? '1px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
      transform: hovered ? 'translateY(-0.25rem)' : 'translateY(0)',
    }
  }
  // primary
  return {
    background: hovered ? '#b8ef00' : '#C8FF00',
    color: '#121213',
    border: hovered ? '1px solid #b8ef00' : '1px solid #C8FF00',
    transform: hovered ? 'translateY(-0.25rem)' : 'translateY(0)',
  }
}

export default function Button({
  variant = 'primary',
  size = 'default',
  href,
  onClick,
  children,
  className,
  type = 'button',
  disabled = false,
  style: extraStyle,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false)

  const combinedStyle: React.CSSProperties = {
    ...BASE,
    ...getSize(size),
    ...getVariantStyles(variant, hovered && !disabled),
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...extraStyle,
  }

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }

  if (href) {
    // Internal link → Next.js Link, external → <a>
    const isExternal = href.startsWith('http') || href.startsWith('//')
    if (isExternal) {
      return (
        <a href={href} className={className} style={combinedStyle} {...handlers} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={className} style={combinedStyle} {...handlers}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      style={combinedStyle}
      onClick={onClick}
      {...handlers}
    >
      {children}
    </button>
  )
}
