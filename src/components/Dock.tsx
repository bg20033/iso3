import { Factory, Home, Mail, PanelsTopLeft } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Start', icon: Home },
  { to: '/loesungen', label: 'Lösungen', icon: PanelsTopLeft },
  { to: '/ueber-uns', label: 'IsoMat', icon: Factory },
  { to: '/kontakt', label: 'Anfrage', icon: Mail },
]

export function Dock() {
  const reduceMotion = useReducedMotion()

  return (
    <nav className="dock" aria-label="Schnellnavigation">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          to={to}
          end={to === '/'}
          aria-label={label}
          className={({ isActive }) =>
            ['dock__item', isActive && 'is-active'].filter(Boolean).join(' ')
          }
          key={to}
        >
          <motion.span
            whileHover={reduceMotion ? undefined : { y: -7, scale: 1.12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          >
            <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
          </motion.span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
