import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BenefitGrid } from '../components/BenefitGrid'
import BlurText from '../components/BlurText'
import { PageHead } from '../components/PageHead'
import { ProcessStory } from '../components/ProcessStory'
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

      <section className="section section--metal">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Leistung</span>
              <BlurText text="Vier Prinzipien für jede Lösung." />
            </div>
          </div>
          <BenefitGrid benefits={coreBenefits} />
        </div>
      </section>

      <section className="section section--graphite">
        <div className="shell editorial-grid">
          <div>
            <span className="eyebrow">Arbeitsweise</span>
            <BlurText text="Ein klarer Weg zur Massanfertigung." />
          </div>
          <ProcessStory steps={processSteps} />
        </div>
      </section>

      <section className="section section--black">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Archiv</span>
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
