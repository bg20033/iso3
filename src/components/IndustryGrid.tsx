import { industries } from '../data/site'

export function IndustryGrid() {
  return (
    <div className="industry-grid">
      {industries.map((industry) => (
        <article className="industry-card" key={industry.no}>
          <span className="industry-card__no">{industry.no}</span>
          <h3>{industry.title}</h3>
          <p>{industry.text}</p>
          <ul className="industry-card__components">
            {industry.components.map((component) => (
              <li key={component}>{component}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
