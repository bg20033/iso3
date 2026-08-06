import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav } from '../data/site'
import { Logo } from './Logo'

export function Header() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a[href]')
    firstLink?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

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
          ref={menuButtonRef}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menü schliessen' : 'Menü öffnen'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobile Navigation"
          ref={menuRef}
        >
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
