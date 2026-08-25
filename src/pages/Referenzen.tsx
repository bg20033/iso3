import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ReferenceDome } from '../components/ReferenceDome'
import { featuredReferences } from '../data/site'
import { useLanguage } from '../i18n'

const sectors = [
  ['Kehrichtverbrennungsanlagen', 'Waste-to-energy plants'],
  ['Fernwärme-/Nahwärmeanlagen und Heizwerke', 'District and local heating plants'],
  ['Papier- und Kartonfabriken', 'Paper and board mills'],
  ['Zementwerke', 'Cement plants'],
  ['Chemie- und Pharmaanlagen', 'Chemical and pharmaceutical plants'],
  ['Holz-/Biomasse-Heizkraftwerke', 'Wood and biomass cogeneration plants'],
  ['Lebensmittelindustrie', 'Food processing industry'],
  ['Kläranlagen mit Schlammverbrennung/Biogasanlagen', 'Wastewater, sludge incineration and biogas plants'],
  ['Gebäudetechnik-Anlagen', 'Building services installations'],
] as const

export default function Referenzen() {
  const { language, pick } = useLanguage()

  return (
    <>
      <PageHead
        index="03 · Referenzen"
        crumb={pick('Referenzen', 'References')}
        title={pick('Erfahrung aus anspruchsvollen Industrieanlagen.', 'Experience from demanding industrial plants.')}
        lead={pick('IsoMat entwickelt passgenaue, abnehmbare Isolierungslösungen für wärmetechnisch anspruchsvolle Komponenten und Anlagen.', 'IsoMat develops precision-fit, removable insulation solutions for thermally demanding components and plants.')}
      />

      <section className="section section--light reference-sectors">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div>
              <span className="eyebrow">01 · {pick('Einsatzfelder', 'Applications')}</span>
              <h2>{pick('Branchen, in denen jedes Detail zählt.', 'Industries where every detail matters.')}</h2>
            </div>
            <p>{pick('Unsere Lösungen werden für unterschiedliche Betriebsbedingungen, Geometrien und Wartungsanforderungen individuell ausgelegt.', 'Our solutions are individually designed for different operating conditions, geometries and maintenance requirements.')}</p>
          </div>

          <ol className="reference-sector-grid">
            {sectors.map((sector, index) => (
              <li key={sector[0]}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{sector[language === 'de' ? 0 : 1]}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--black references-section">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div>
              <span className="eyebrow">02 · {pick('Ausgeführte Arbeiten', 'Completed work')}</span>
              <h2>{pick('Vorher und nachher an realen Turbinen.', 'Before and after on real turbines.')}</h2>
            </div>
            <p>{pick('Vierzehn neue Aufnahmen zeigen sieben Anlagen vor und nach der Montage der mehrteiligen IsoMat-Isolierung.', 'Fourteen new photographs show seven plants before and after installation of the multi-part IsoMat insulation.')}</p>
          </div>
          <ReferenceDome images={featuredReferences} />
        </div>
      </section>

      <section className="contact-band contact-band--redesign">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">{pick('Ihre Anlage', 'Your plant')}</span>
          <h2>{pick('Besprechen wir Ihre Einbausituation.', 'Let’s discuss your installation.')}</h2>
          <Link className="button button--light" to="/kontakt">
            {pick('Projekt anfragen', 'Request a project')} <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
