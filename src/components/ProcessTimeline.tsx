import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'

type ProcessStep = readonly [string, string, string]

function TimelineStep({
  step: [no, title, text],
  index,
}: {
  step: ProcessStep
  index: number
}) {
  const { ref, inView } = useInView<HTMLLIElement>()

  return (
    <li
      ref={ref}
      className={inView ? 'is-visible' : undefined}
      style={{ '--step-delay': `${index * 65}ms` } as CSSProperties}
    >
      <span>{no}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </li>
  )
}

export function ProcessTimeline({ steps }: { steps: readonly ProcessStep[] }) {
  return (
    <ol className="process-list process-list--animated">
      {steps.map((step, index) => (
        <TimelineStep step={step} index={index} key={step[0]} />
      ))}
    </ol>
  )
}
