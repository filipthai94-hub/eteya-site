interface AccordionRowHeaderProps {
  prefix: 'service' | 'case'
  title: string
  indexDisplay: string
  counterLineCount: number
  activeLineIndex: number
}

export default function AccordionRowHeader({
  prefix,
  title,
  indexDisplay,
  counterLineCount,
  activeLineIndex,
}: AccordionRowHeaderProps) {
  return (
    <div className={`${prefix}-title`}>
      <i className={`${prefix}-arrow`}></i>
      {title}
      <div className={`${prefix}-counter`}>
        <span>{indexDisplay}</span>
        <div className={`${prefix}-counter-lines`}>
          {Array.from({ length: counterLineCount }).map((_, idx) => (
            <span
              key={idx}
              className={`${prefix}-counter-line ${idx === activeLineIndex ? 'is-active' : ''}`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  )
}
