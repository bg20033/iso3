import SpotlightCard from './SpotlightCard'
import { Reveal } from './Reveal'

type Benefit = {
  title: string
  text: string
}

export function BenefitGrid({ benefits }: { benefits: readonly Benefit[] }) {
  return (
    <div className="benefit-grid">
      {benefits.map((benefit, index) => (
        <Reveal delay={index * 70} key={benefit.title}>
          <SpotlightCard
            className="benefit-card"
            spotlightColor="rgba(214, 38, 34, 0.14)"
          >
            <span>0{index + 1}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
  )
}
