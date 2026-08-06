import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { coreBenefits, featuredReferences, processSteps } from '../data/site'

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
  return (
    <>
      <PageHead
        index="02 · IsoMat"
        crumb="Über uns"
        title="Isoliertechnik beginnt mit genauem Hinsehen."
        lead="In Spreitenbach entstehen massgefertigte Dämmkissen und flexible Isolierungssysteme für den industriellen Betrieb."
      />

      <dl className="landing-proof about-proof" aria-label="IsoMat auf einen Blick">
        <div><dt>Produktion</dt><dd>Spreitenbach</dd></div>
        <div><dt>Erfahrung</dt><dd>15+ Jahre</dd></div>
        <div><dt>Fertigung</dt><dd>Einzelstück</dd></div>
        <div><dt>Leistung</dt><dd>7 Kategorien</dd></div>
      </dl>

      <section className="section section--light about-story">
        <div className="shell about-story__grid">
          <div>
            <span className="eyebrow">Wer wir sind</span>
            <h2>Ein Betrieb. Eine Werkstatt. Jedes Teil ein Unikat.</h2>
          </div>
          <div className="prose prose--large">
            <p>
              IsoMat entwickelt individuelle Isolierungslösungen für reale
              Betriebsbedingungen. Geometrie, Temperatur, Bewegung und
              Zugänglichkeit bestimmen jede Konstruktion.
            </p>
            <p>
              Das Ergebnis ist eine flexible, segmentierte Isolierung, die
              Wärmeverluste reduziert und sich für Wartung oder Inspektion
              wiederholt entfernen und montieren lässt.
            </p>
          </div>
        </div>
        <div className="shell about-scope">
          {scope.map((item, index) => (
            <span key={item}><b>{String(index + 1).padStart(2, '0')}</b>{item}</span>
          ))}
        </div>
      </section>

      <section className="section section--metal">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div><span className="eyebrow">Unser Anspruch</span><h2>Für den Betrieb gemacht.</h2></div>
            <p>Vier Prinzipien verbinden Energieeffizienz, Sicherheit und Wartungszugang.</p>
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
            <span className="eyebrow">Arbeitsweise</span>
            <h2>Ein klarer Weg zur Massanfertigung.</h2>
            <p>Persönliche Beratung, präzise Fertigung und zuverlässige Lieferung – vom ersten Bild bis zur Montage.</p>
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
          <div className="section-heading section-heading--redesign section-heading--dark">
            <div><span className="eyebrow">Aus der Fertigung</span><h2>Lösungen aus realen Anlagen.</h2></div>
            <p>Ein Querschnitt durch Komponenten und Einbausituationen.</p>
          </div>
          <div className="reference-grid-redesign">
            {featuredReferences.slice(0, 6).map((image, index) => (
              <a href={image.src} target="_blank" rel="noreferrer" key={image.src}>
                <ResponsiveImage image={image} />
                <span>{String(index + 1).padStart(2, '0')} · Aufnahme öffnen</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-band contact-band--redesign">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">Ihre Anwendung</span>
          <h2>Gemeinsam zur passenden Konstruktion.</h2>
          <Link className="button button--light" to="/kontakt">
            Kontakt aufnehmen <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
