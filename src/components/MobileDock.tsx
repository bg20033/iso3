import { Factory, Home, Mail, PanelsTopLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Dock from './Dock'
import { useLanguage } from '../i18n'

const items = [
  { to: '/', label: 'Start', icon: Home },
  { to: '/loesungen', label: 'Lösungen', icon: PanelsTopLeft },
  { to: '/ueber-uns', label: 'IsoMat', icon: Factory },
  { to: '/kontakt', label: 'Anfrage', icon: Mail },
]

export function MobileDock() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { pick } = useLanguage()
  const localizedItems = items.map((item) => ({
    ...item,
    label: item.to === '/' ? pick('Start', 'Home')
      : item.to === '/loesungen' ? pick('Lösungen', 'Solutions')
      : item.to === '/kontakt' ? pick('Anfrage', 'Enquiry')
      : 'IsoMat',
  }))

  return (
    <nav className="mobile-dock" aria-label={pick('Schnellnavigation', 'Quick navigation')}>
      <Dock
        panelHeight={62}
        dockHeight={96}
        baseItemSize={46}
        magnification={58}
        distance={120}
        items={localizedItems.map(({ to, label, icon: Icon }) => ({
          label,
          className:
            pathname === to ||
            (to !== '/' && pathname.startsWith(`${to}/`)) ||
            (to === '/loesungen' && pathname.startsWith('/produkte/'))
              ? 'is-active'
              : undefined,
          icon: <Icon size={20} strokeWidth={1.8} aria-hidden="true" />,
          onClick: () => navigate(to),
        }))}
      />
    </nav>
  )
}
