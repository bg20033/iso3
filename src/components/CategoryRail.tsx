import { ResponsiveImage } from './ResponsiveImage'
import { scrollToSection, useScrollSpy } from '../hooks/useScrollSpy'
import type { Solution } from '../data/site'
import { railAnchor } from './categoryAnchors'

type CategoryRailProps = {
  solutions: Solution[]
}

/**
 * Die Kategorien als Kartenleiste. Am Desktop klebt sie neben den Bauteilen,
 * auf dem Telefon liegt sie als schmaler Streifen darüber.
 */
export function CategoryRail({ solutions }: CategoryRailProps) {
  const ids = solutions.map(railAnchor)
  const active = useScrollSpy(ids.join('|'))

  return (
    <nav className="category-rail" aria-label="Kategorien">
      <span className="category-rail__label">
        Kategorien
        <b>{String(solutions.length).padStart(2, '0')}</b>
      </span>

      <ol className="category-rail__list">
        {solutions.map((solution, index) => (
          <li key={solution.slug}>
            <a
              className="category-rail__card"
              href={`#${railAnchor(solution)}`}
              aria-label={`Zur Kategorie ${solution.title}`}
              aria-current={index === active ? 'true' : undefined}
              onClick={(event) => {
                event.preventDefault()
                scrollToSection(railAnchor(solution))
              }}
            >
              <span className="category-rail__media">
                <ResponsiveImage image={solution.featuredImage} />
              </span>
              <span className="category-rail__text">
                <b>{solution.no}</b>
                <strong>{solution.shortTitle}</strong>
                <small>{solution.applications.slice(0, 2).join(' · ')}</small>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
