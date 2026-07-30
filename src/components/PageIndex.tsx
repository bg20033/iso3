import { scrollToSection, useScrollSpy } from '../hooks/useScrollSpy'

export type PageIndexItem = { id: string; label: string }

type PageIndexProps = {
  items: PageIndexItem[]
  label?: string
  /** Alternative zum Scroll-Spy: Index wird von aussen gesetzt. */
  activeIndex?: number | null
  onSelect?: (index: number) => void
}

/**
 * Klebende Leiste am linken Rand. Eine durchgehende Linie trägt die
 * Abschnitte; der gelesene Teil ist ausgezogen, der aktuelle rot markiert.
 */
export function PageIndex({
  items,
  label = 'Index',
  activeIndex,
  onSelect,
}: PageIndexProps) {
  const idKey = items.map((item) => item.id).join('|')
  const spyIndex = useScrollSpy(idKey, activeIndex === undefined)
  const active = activeIndex === undefined ? spyIndex : activeIndex

  return (
    <nav className="page-index" aria-label={label}>
      <span className="page-index__label">
        {label}
        <b>{String(items.length).padStart(2, '0')}</b>
      </span>

      <ol className="page-index__list">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              className="page-index__item"
              type="button"
              data-state={
                active === null || active === undefined
                  ? 'ahead'
                  : index < active
                    ? 'passed'
                    : index === active
                      ? 'current'
                      : 'ahead'
              }
              aria-current={index === active ? 'true' : undefined}
              onClick={() =>
                onSelect ? onSelect(index) : scrollToSection(item.id)
              }
            >
              <span className="page-index__rule" aria-hidden="true" />
              <span className="page-index__no">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="page-index__text">{item.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
