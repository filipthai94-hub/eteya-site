import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  href?: string
}

export default function Button({ variant = 'primary', className, children, href, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 min-h-[44px]'
  const variants = {
    primary: 'bg-et-accent text-et-bg hover:bg-et-accent/90',
    outline: 'border border-et-accent text-et-accent hover:bg-et-accent hover:text-et-bg',
  }

  if (href) {
    return (
      <a href={href} className={cn(base, variants[variant], className)}>
        {children}
      </a>
    )
  }

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
