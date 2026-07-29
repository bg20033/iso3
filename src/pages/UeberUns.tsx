import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import BlurText from '../components/BlurText'
import { PageHead } from '../components/PageHead'
import { ReferenceDome } from '../components/ReferenceDome'
import {
  coreBenefits,
  featuredReferences,
  processSteps,
} from '../data/site'

export default function UeberUns() {
  return (
    <>
      <PageHead
        index="02 · IsoMat"
        crumb="Über uns"
        title="Isoliertechnik beginnt mit genauem Hinsehen."
        lead="IsoMat entwickelt Dämmkissen und Isoliermatratzen für industrielle Komponenten, bei denen Standardlösungen nicht ausreichen."
      />

      <section className="section section--light">
        <div className="shell editorial-grid">
          <div>
            <span className="eyebrow">Unser Ansatz</span>
            <BlurText text="Individuell konstruiert. Für den Betrieb gemacht." />
          </div>
          <div className="prose prose--large">
            <p>
              Pumpen, Ventile, Flansche, Turbinen und Sonderbauteile unterscheiden
              sich in Geometrie, Temperatur, Bewegung und Zugänglichkeit. Deshalb
              wird jede IsoMat-Lösung auf die tatsächliche Komponente abgestimmt.
            </p>
            <p>
              Das Ergebnis ist eine flexible, segmentierte Isolierung, die
              Wärmeverluste reduziert und sich für Wartung oder Inspektion
              wiederholt entfernen und montieren lässt.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--graphite">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <div>
              <span className="eyebrow eyebrow--light">Leistung</span>
              <BlurText text="Vier Prinzipien für jede Lösung." />
            </div>
          </div>
          <div className="benefit-grid">
            {coreBenefits.map((benefit, index) => (
              <article className="benefit-card" key={benefit.title}>
                <span>0{index + 1}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--metal">
        <div className="shell editorial-grid">
          <div>
            <span className="eyebrow">Arbeitsweise</span>
            <BlurText text="Ein klarer Weg zur Massanfertigung." />
          </div>
          <ol className="process-list">
            {processSteps.map(([no, title, text]) => (
              <li key={no}>
                <span>{no}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--black">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <div>
              <span className="eyebrow eyebrow--light">Archiv</span>
              <BlurText text="Lösungen aus realen Anlagen." />
            </div>
            <p>Ein Querschnitt durch verschiedene Komponenten und Einbausituationen.</p>
          </div>
          <ReferenceDome images={featuredReferences} />
        </div>
      </section>

      <section className="contact-band">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">Ihre Anwendung</span>
          <h2>Gemeinsam zur passenden Konstruktion.</h2>
          <Link className="button button--light" to="/kontakt">
            Kontakt aufnehmen <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
