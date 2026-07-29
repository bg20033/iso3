import { PageHead } from '../components/PageHead'
import { company } from '../data/site'

export default function Impressum() {
  return (
    <>
      <PageHead
        index="Rechtliches"
        crumb="Impressum"
        title="Impressum"
        lead="Kontaktangaben des Anbieters dieser Website."
      />
      <section className="section section--light">
        <div className="shell legal prose">
          <h2>{company.name}</h2>
          <address>
            {company.street}
            <br />
            {company.city}
          </address>
          <p>
            Telefon: <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
            <br />
            E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
          <h2>Haftung für Inhalte</h2>
          <p>
            Die Inhalte dieser Website wurden mit Sorgfalt aus den von IsoMat
            bereitgestellten Unternehmensunterlagen zusammengestellt. Für
            projektbezogene technische Angaben ist eine individuelle Beratung
            erforderlich.
          </p>
          <h2>Urheberrecht</h2>
          <p>
            Texte, Fotografien und Gestaltung dieser Website dürfen ohne
            Zustimmung der jeweiligen Rechteinhaber nicht vervielfältigt oder
            weiterverwendet werden.
          </p>
        </div>
      </section>
    </>
  )
}
