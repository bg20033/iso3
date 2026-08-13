import { PageHead } from '../components/PageHead'
import { company } from '../data/site'
import { useLanguage } from '../i18n'

export default function Impressum() {
  const { pick } = useLanguage()
  return (
    <>
      <PageHead
        index={pick('Rechtliches', 'Legal')}
        crumb={pick('Impressum', 'Legal notice')}
        title={pick('Impressum', 'Legal notice')}
        lead={pick('Kontaktangaben des Anbieters dieser Website.', 'Contact details for the provider of this website.')}
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
            {pick('Telefon', 'Phone')}: <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
            <br />
            E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
          <h2>{pick('Haftung für Inhalte', 'Liability for content')}</h2>
          <p>
            {pick('Die Inhalte dieser Website wurden mit Sorgfalt aus den von IsoMat bereitgestellten Unternehmensunterlagen zusammengestellt. Für projektbezogene technische Angaben ist eine individuelle Beratung erforderlich.', 'The content of this website was prepared with care from company documents provided by IsoMat. Individual advice is required for project-specific technical information.')}
          </p>
          <h2>{pick('Urheberrecht', 'Copyright')}</h2>
          <p>
            {pick('Texte, Fotografien und Gestaltung dieser Website dürfen ohne Zustimmung der jeweiligen Rechteinhaber nicht vervielfältigt oder weiterverwendet werden.', 'The text, photographs and design of this website may not be reproduced or reused without the consent of the respective rights holders.')}
          </p>
        </div>
      </section>
    </>
  )
}
