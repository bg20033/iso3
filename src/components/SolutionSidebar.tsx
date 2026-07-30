import { useNavigate } from 'react-router-dom'
import type { Solution } from '../data/site'
import { PageIndex } from './PageIndex'
import { scrollToSection } from '../hooks/useScrollSpy'

type SolutionSidebarProps = {
  solutions: Solution[]
  /**
   * `detail` – markiert die geöffnete Lösung, Klick wechselt die Seite.
   * `index` – folgt dem Scrollstand der Abschnitte auf dieser Seite.
   */
  mode?: 'detail' | 'index'
  activeSlug?: string
  label?: string
}

export function SolutionSidebar({
  solutions,
  mode = 'detail',
  activeSlug,
  label = 'Lösungen',
}: SolutionSidebarProps) {
  const navigate = useNavigate()
  const items = solutions.map((solution) => ({
    id: solution.slug,
    label: solution.shortTitle,
  }))

  if (mode === 'index') {
    return <PageIndex items={items} label={label} />
  }

  const detailIndex = solutions.findIndex(
    (solution) => solution.slug === activeSlug,
  )

  return (
    <PageIndex
      items={items}
      label={label}
      activeIndex={detailIndex === -1 ? null : detailIndex}
      onSelect={(index) => {
        const target = solutions[index]
        if (target.slug === activeSlug) {
          scrollToSection(target.slug)
          return
        }
        navigate(`/produkte/${target.productSlug}`)
      }}
    />
  )
}
