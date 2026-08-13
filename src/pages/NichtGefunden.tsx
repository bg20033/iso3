import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

export default function NichtGefunden() {
  const { pick } = useLanguage()
  return (
    <section className="section section--black error-page">
      <div className="shell">
        <span className="eyebrow">{pick('Fehler', 'Error')} 404</span>
        <h1>{pick('Seite nicht gefunden.', 'Page not found.')}</h1>
        <p>
          {pick('Die aufgerufene Adresse existiert nicht. Über die Navigation finden Sie zurück zu unseren Lösungen.', 'The requested address does not exist. Use the navigation to return to our solutions.')}
        </p>
        <Link to="/" className="button">
          {pick('Zur Startseite', 'Back to home')} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
