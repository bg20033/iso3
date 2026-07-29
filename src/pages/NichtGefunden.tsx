import { Link } from 'react-router-dom'

export default function NichtGefunden() {
  return (
    <section className="section section--black error-page">
      <div className="shell">
        <span className="eyebrow eyebrow--light">Fehler 404</span>
        <h1>Seite nicht gefunden.</h1>
        <p>
          Die aufgerufene Adresse existiert nicht. Über die Navigation finden
          Sie zurück zu unseren Lösungen.
        </p>
        <Link to="/" className="button button--light">
          Zur Startseite <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
