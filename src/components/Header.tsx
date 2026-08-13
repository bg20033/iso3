import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav } from '../data/site'
import { useLanguage } from '../i18n'
import { Logo } from './Logo'

export function Header() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const { language, setLanguage, pick } = useLanguage()
  const localizedNav = nav.map((item) => ({
    ...item,
    label: item.to === '/' ? pick('Start', 'Home')
      : item.to === '/loesungen' ? pick('Lösungen', 'Solutions')
      : item.to === '/ueber-uns' ? pick('Über uns', 'About us')
      : pick('Kontakt', 'Contact'),
  }))

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
        <Link to="/" aria-label={pick('IsoMat Startseite', 'IsoMat home')}>
          <Logo />
        </Link>

        <nav className="header__nav" aria-label={pick('Hauptnavigation', 'Main navigation')}>
          {localizedNav.map((item) => (
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
          <div className="language-switch" role="group" aria-label={pick('Sprache', 'Language')}>
            {(['de', 'en'] as const).map((item) => (
              <button
                type="button"
                className={language === item ? 'is-active' : ''}
                aria-pressed={language === item}
                onClick={() => setLanguage(item)}
                key={item}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="header__phone" href="tel:+41562451628">
            056 245 16 28
          </a>
          <Link className="button button--compact header__cta" to="/kontakt">
            {pick('Projekt anfragen', 'Request a project')}
          </Link>
        </div>

        <button
          type="button"
          className="menu-button"
          ref={menuButtonRef}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? pick('Menü schliessen', 'Close menu') : pick('Menü öffnen', 'Open menu')}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label={pick('Mobile Navigation', 'Mobile navigation')}
          ref={menuRef}
        >
          <div className="language-switch language-switch--mobile" role="group" aria-label={pick('Sprache', 'Language')}>
            {(['de', 'en'] as const).map((item) => (
              <button type="button" className={language === item ? 'is-active' : ''} aria-pressed={language === item} onClick={() => setLanguage(item)} key={item}>
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          {localizedNav.map((item) => (
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
            {pick('Projekt anfragen', 'Request a project')} <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      )}
    </header>
  )
}
