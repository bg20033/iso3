import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav } from '../data/site'
import { useLanguage } from '../i18n'
import { Logo } from './Logo'

export function Header() {
  const location = useLocation()
  const { language, setLanguage, pick } = useLanguage()
  const localizedNav = nav.map((item) => ({
    ...item,
    label: item.to === '/' ? pick('Start', 'Home')
      : item.to === '/loesungen' ? pick('Lösungen', 'Solutions')
      : item.to === '/ueber-uns' ? pick('Über uns', 'About us')
      : pick('Kontakt', 'Contact'),
  }))

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

        <div className="mobile-language-switch language-switch" role="group" aria-label={pick('Sprache', 'Language')}>
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
      </div>
    </header>
  )
}
