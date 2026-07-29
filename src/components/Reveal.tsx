import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

type RevealProps = {
  children: ReactNode
  /** Verzögerung in Millisekunden für gestaffelte Auftritte */
  delay?: number
  className?: string
}

/** Blendet Inhalte beim Scrollen sanft ein. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={['reveal', inView && 'is-visible', className]
        .filter(Boolean)
        .join(' ')}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
