import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav } from '../data/site'
import { Logo } from './Logo'

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header className="header">
      <div className="shell header__bar">
        <Link to="/" aria-label="IsoMat Startseite">
          <Logo />
        </Link>

        <nav className="header__nav" aria-label="Hauptnavigation">
          {nav.map((item) => (
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ||
                (item.to === '/loesungen' &&
                  location.pathname.startsWith('/produkte/'))
                  ? 'is-active'
                  : ''
              }
              key={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <a className="header__phone" href="tel:+41562451628">
            056 245 16 28
          </a>
          <Link className="button button--compact header__cta" to="/kontakt">
            Projekt anfragen
          </Link>
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menü schliessen' : 'Menü öffnen'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile Navigation">
          {nav.map((item) => (
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ||
                (item.to === '/loesungen' &&
                  location.pathname.startsWith('/produkte/'))
                  ? 'is-active'
                  : ''
              }
              key={item.to}
            >
              {item.label}
            </NavLink>
          ))}
          <a href="tel:+41562451628">056 245 16 28</a>
          <Link className="button" to="/kontakt">
            Projekt anfragen <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      )}
    </header>
  )
}
