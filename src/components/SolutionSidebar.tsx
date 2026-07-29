import { useNavigate } from 'react-router-dom'
import type { Solution } from '../data/site'
import LineSidebar from './LineSidebar'

type SolutionSidebarProps = {
  solutions: Solution[]
  activeSlug?: string
}

export function SolutionSidebar({
  solutions,
  activeSlug,
}: SolutionSidebarProps) {
  const navigate = useNavigate()
  const activeIndex = activeSlug
    ? solutions.findIndex((solution) => solution.slug === activeSlug)
    : null

  return (
    <LineSidebar
      key={activeSlug ?? 'solutions'}
      className="reactbits-line-sidebar"
      items={solutions.map((solution) => solution.shortTitle)}
      accentColor="#d62622"
      textColor="#6d7376"
      markerColor="#9da3a6"
      proximityRadius={120}
      maxShift={16}
      markerLength={48}
      markerGap={8}
      tickScale={0.65}
      itemGap={13}
      fontSize={0.88}
      smoothing={90}
      defaultActive={activeIndex === -1 ? null : activeIndex}
      onItemClick={(index) => {
        navigate(`/loesungen/${solutions[index].slug}`)
      }}
    />
  )
}
