import { Link } from 'react-router-dom'
import { company, nav } from '../data/site'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__main">
          <div>
            <Logo />
            <p className="footer__claim">
              Massgefertigte, abnehmbare Isolierungen für industrielle Anlagen.
            </p>
          </div>

          <div>
            <span className="footer__label">Navigation</span>
            {nav.map((item) => (
              <Link to={item.to} key={item.to}>
                {item.label}
              </Link>
            ))}
          </div>

          <address>
            <span className="footer__label">Direktkontakt</span>
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
            <Link to="/impressum">Impressum</Link>
            <Link to="/datenschutz">Datenschutz</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
