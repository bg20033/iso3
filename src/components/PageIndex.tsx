import LineSidebar from './LineSidebar'
import { scrollToSection, useScrollSpy } from '../hooks/useScrollSpy'

export type PageIndexItem = { id: string; label: string }

type PageIndexProps = {
  items: PageIndexItem[]
  label?: string
}

/**
 * Klebender Blattindex am linken Rand. Markiert den Abschnitt, der gerade
 * gelesen wird, und springt beim Klick dorthin.
 */
export function PageIndex({ items, label = 'Index' }: PageIndexProps) {
  const idKey = items.map((item) => item.id).join('|')
  const activeIndex = useScrollSpy(idKey)

  return (
    <div className="solutions-nav">
      <span className="solutions-nav__label">
        {label}
        <b>{String(items.length).padStart(2, '0')}</b>
      </span>
      <LineSidebar
        key={activeIndex ?? 'none'}
        className="reactbits-line-sidebar"
        items={items.map((item) => item.label)}
        accentColor="#d62622"
        textColor="#454c4f"
        markerColor="#a9afb2"
        proximityRadius={110}
        maxShift={14}
        markerLength={44}
        markerGap={10}
        tickScale={0.55}
        itemGap={16}
        fontSize={0.95}
        smoothing={90}
        defaultActive={activeIndex}
        onItemClick={(index) => scrollToSection(items[index].id)}
      />
    </div>
  )
}
