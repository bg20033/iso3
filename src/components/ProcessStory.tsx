import { ScrollStackItem } from './ScrollStack'
import ScrollStack from './ScrollStack'
import { useInteractiveVisuals } from './useInteractiveVisuals'

type ProcessStep = readonly [string, string, string]

export function ProcessStory({ steps }: { steps: readonly ProcessStep[] }) {
  const interactive = useInteractiveVisuals()

  return (
    <ScrollStack className="process-stack" disabled={!interactive}>
      {steps.map(([no, title, text], index) => (
        <ScrollStackItem itemClassName="process-stack__card" key={no}>
          <div className="process-stack__meta">
            <span>{no}</span>
            <span>{String(index + 1).padStart(2, '0')} / 05</span>
          </div>
          <h3>{title}</h3>
          <p>{text}</p>
          <div className="process-stack__rail" aria-hidden="true">
            <span style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
          </div>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  )
}
