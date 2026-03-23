import { cn } from '@/lib/utils'

export default function SectionTitle({
  label,
  heading,
  className,
}: {
  label?: string
  heading: string
  className?: string
}) {
  return (
    <div className={cn('mb-12', className)}>
      {label && (
        <p className="text-accent text-sm tracking-widest uppercase mb-4">{label}</p>
      )}
      <h2 className="font-display text-4xl md:text-6xl text-primary uppercase leading-none">
        {heading}
      </h2>
    </div>
  )
}
