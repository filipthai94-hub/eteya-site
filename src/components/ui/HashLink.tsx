'use client'

import Link from 'next/link'

interface HashLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export default function HashLink({ href, children, className, onClick }: HashLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
