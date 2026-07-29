import { Link } from 'react-router-dom'
import type { Solution } from '../data/site'

export function LineSidebar({
  solutions,
  activeSlug,
}: {
  solutions: Solution[]
  activeSlug?: string
}) {
  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const items = event.currentTarget.querySelectorAll<HTMLElement>(
      '.line-sidebar__item',
    )
    items.forEach((item) => {
      const rect = item.getBoundingClientRect()
      const distance = Math.abs(event.clientY - (rect.top + rect.height / 2))
      const influence = Math.max(0, 1 - distance / 120)
      item.style.setProperty('--proximity', String(influence))
    })
  }

  const onLeave = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget
      .querySelectorAll<HTMLElement>('.line-sidebar__item')
      .forEach((item) => item.style.setProperty('--proximity', '0'))
  }

  return (
    <nav
      className="line-sidebar"
      aria-label="Lösungsbereiche"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {solutions.map((solution) => (
        <Link
          className={[
            'line-sidebar__item',
            solution.slug === activeSlug && 'is-active',
          ]
            .filter(Boolean)
            .join(' ')}
          to={`/loesungen/${solution.slug}`}
          key={solution.slug}
        >
          <span className="line-sidebar__mark" aria-hidden="true" />
          <span className="line-sidebar__no">{solution.no}</span>
          <span>{solution.shortTitle}</span>
        </Link>
      ))}
    </nav>
  )
}
