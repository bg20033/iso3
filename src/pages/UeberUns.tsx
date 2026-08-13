import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { featuredReferences } from '../data/site'
import { useLanguage, useLocalizedSite } from '../i18n'

const scope = [
  'Ventile',
  'Flansche',
  'Kompensatoren',
  'Turbinen',
  'Wärmetauscher',
  'Rohrleitungen',
  'Behälter',
  'Sonderbauteile',
]

export default function UeberUns() {
  const { language, pick } = useLanguage()
  const { coreBenefits, processSteps } = useLocalizedSite()
  const localizedScope = language === 'de'
    ? scope
    : ['Valves', 'Flanges', 'Expansion joints', 'Turbines', 'Heat exchangers', 'Pipework', 'Vessels', 'Custom components']
  return (
    <>
      <PageHead
        index="02 · IsoMat"
        crumb={pick('Über uns', 'About us')}
        title={pick('Isoliertechnik beginnt mit genauem Hinsehen.', 'Insulation engineering starts with a close look.')}
        lead={pick('In Spreitenbach entstehen massgefertigte Dämmkissen und flexible Isolierungssysteme für den industriellen Betrieb.', 'In Spreitenbach, we manufacture custom insulation jackets and flexible insulation systems for industrial operation.')}
      />

      <dl className="landing-proof about-proof" aria-label={pick('IsoMat auf einen Blick', 'IsoMat at a glance')}>
        <div><dt>{pick('Produktion', 'Production')}</dt><dd>Spreitenbach</dd></div>
        <div><dt>{pick('Erfahrung', 'Experience')}</dt><dd>15+ {pick('Jahre', 'years')}</dd></div>
        <div><dt>{pick('Fertigung', 'Manufacturing')}</dt><dd>{pick('Einzelstück', 'One-off')}</dd></div>
        <div><dt>{pick('Leistung', 'Range')}</dt><dd>7 {pick('Kategorien', 'categories')}</dd></div>
      </dl>

      <section className="section section--light about-story">
        <div className="shell about-story__grid">
          <div>
            <span className="eyebrow">{pick('Wer wir sind', 'Who we are')}</span>
            <h2>{pick('Ein Betrieb. Eine Werkstatt. Jedes Teil ein Unikat.', 'One company. One workshop. Every part unique.')}</h2>
          </div>
          <div className="prose prose--large">
            <p>
              {pick('IsoMat entwickelt individuelle Isolierungslösungen für reale Betriebsbedingungen. Geometrie, Temperatur, Bewegung und Zugänglichkeit bestimmen jede Konstruktion.', 'IsoMat develops individual insulation solutions for real operating conditions. Geometry, temperature, movement and accessibility shape every design.')}
            </p>
            <p>
              {pick('Das Ergebnis ist eine flexible, segmentierte Isolierung, die Wärmeverluste reduziert und sich für Wartung oder Inspektion wiederholt entfernen und montieren lässt.', 'The result is flexible, segmented insulation that reduces heat loss and can be repeatedly removed and refitted for maintenance or inspection.')}
            </p>
          </div>
        </div>
        <div className="shell about-scope">
          {localizedScope.map((item, index) => (
            <span key={item}><b>{String(index + 1).padStart(2, '0')}</b>{item}</span>
          ))}
        </div>
      </section>

      <section className="section section--metal">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div><span className="eyebrow">{pick('Unser Anspruch', 'Our standard')}</span><h2>{pick('Für den Betrieb gemacht.', 'Made for operation.')}</h2></div>
            <p>{pick('Vier Prinzipien verbinden Energieeffizienz, Sicherheit und Wartungszugang.', 'Four principles combine energy efficiency, safety and maintenance access.')}</p>
          </div>
          <div className="home-benefits">
            {coreBenefits.map((benefit, index) => (
              <article key={benefit.title}>
                <span>0{index + 1}</span><h3>{benefit.title}</h3><p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell process-section__grid">
          <div className="process-section__intro">
            <span className="eyebrow">{pick('Arbeitsweise', 'How we work')}</span>
            <h2>{pick('Ein klarer Weg zur Massanfertigung.', 'A clear path to a custom solution.')}</h2>
            <p>{pick('Persönliche Beratung, präzise Fertigung und zuverlässige Lieferung – vom ersten Bild bis zur Montage.', 'Personal advice, precise manufacturing and reliable delivery – from the first image to installation.')}</p>
          </div>
          <ol className="process-steps">
            {processSteps.map(([no, title, text]) => (
              <li key={no}><span>{no}</span><div><h3>{title}</h3><p>{text}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--black references-section">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div><span className="eyebrow">{pick('Aus der Fertigung', 'From production')}</span><h2>{pick('Lösungen aus realen Anlagen.', 'Solutions from real plants.')}</h2></div>
            <p>{pick('Ein Querschnitt durch Komponenten und Einbausituationen.', 'A selection of components and installation situations.')}</p>
          </div>
          <div className="reference-grid-redesign">
            {featuredReferences.slice(0, 6).map((image, index) => (
              <a href={image.src} target="_blank" rel="noreferrer" key={image.src}>
                <ResponsiveImage image={{ ...image, alt: pick(image.alt, `Installed IsoMat insulation – reference ${String(index + 1).padStart(2, '0')}`) }} />
                <span>{String(index + 1).padStart(2, '0')} · {pick('Aufnahme öffnen', 'Open image')}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-band contact-band--redesign">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">{pick('Ihre Anwendung', 'Your application')}</span>
          <h2>{pick('Gemeinsam zur passenden Konstruktion.', 'Together, we find the right design.')}</h2>
          <Link className="button button--light" to="/kontakt">
            {pick('Kontakt aufnehmen', 'Get in touch')} <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
