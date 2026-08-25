import { Link } from 'react-router-dom'
import { company, nav } from '../data/site'
import { Logo } from './Logo'
import { useLanguage } from '../i18n'

export function Footer() {
  const { pick } = useLanguage()
  const localizedNav = nav.map((item) => ({
    ...item,
    label: item.to === '/' ? pick('Start', 'Home')
      : item.to === '/loesungen' ? pick('Lösungen', 'Solutions')
      : item.to === '/ueber-uns' ? pick('Über uns', 'About us')
      : item.to === '/referenzen' ? pick('Referenzen', 'References')
      : pick('Kontakt', 'Contact'),
  }))
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__main">
          <div>
            <Logo />
            <p className="footer__claim">
              {pick('Massgefertigte, abnehmbare Isolierungen für industrielle Anlagen.', 'Custom-made, removable insulation for industrial plants.')}
            </p>
          </div>

          <div>
            <span className="footer__label">Navigation</span>
            {localizedNav.map((item) => (
              <Link to={item.to} key={item.to}>
                {item.label}
              </Link>
            ))}
          </div>

          <address>
            <span className="footer__label">{pick('Direktkontakt', 'Direct contact')}</span>
            {company.name}
            <br />
            {company.street}
            <br />
            {company.city}
            <br />
            <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
            <br />
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </address>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} IsoMat GmbH</span>
          <span>
            <Link to="/impressum">{pick('Impressum', 'Legal notice')}</Link>
            <Link to="/datenschutz">{pick('Datenschutz', 'Privacy')}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
