import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { BlurText } from '../components/BlurText'
import { LineSidebar } from '../components/LineSidebar'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { solutionBySlug, solutions } from '../data/site'

export default function LoesungDetail() {
  const { slug } = useParams()
  const solution = solutionBySlug(slug)

  if (!solution) return <Navigate to="/nicht-gefunden" replace />

  return (
    <>
      <section className="detail-hero">
        <ResponsiveImage image={solution.featuredImage} eager />
        <div className="detail-hero__shade" aria-hidden="true" />
        <div className="shell detail-hero__content">
          <Link className="detail-back" to="/loesungen">
            <ArrowLeft size={17} aria-hidden="true" /> Alle Lösungen
          </Link>
          <span className="eyebrow eyebrow--light">
            {solution.no} · {solution.eyebrow}
          </span>
          <BlurText as="h1" text={solution.title} />
          <p>{solution.summary}</p>
        </div>
      </section>

      <section className="section section--light">
        <div className="shell solutions-layout">
          <aside className="solutions-layout__nav">
            <LineSidebar solutions={solutions} activeSlug={solution.slug} />
          </aside>
          <div>
            <div className="detail-copy">
              <div>
                <span className="eyebrow">Anwendung</span>
                <BlurText text="Passend zur Anlage. Praktisch im Service." />
              </div>
              <div className="prose">
                {solution.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="detail-facts">
              <article>
                <span className="eyebrow">Vorteile</span>
                <ul>
                  {solution.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </article>
              <article>
                <span className="eyebrow">Typische Komponenten</span>
                <div className="tag-list">
                  {solution.applications.map((application) => (
                    <span key={application}>{application}</span>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--graphite">
        <div className="shell">
          <div className="section-heading section-heading--light">
            <div>
              <span className="eyebrow eyebrow--light">Referenzen</span>
              <BlurText text={`Einblicke: ${solution.title}`} />
            </div>
            <p>{solution.gallery.length} reale Aufnahmen aus dem IsoMat-Archiv.</p>
          </div>
          <div className="photo-grid">
            {solution.gallery.map((image, index) => (
              <a
                href={image.src}
                className={index % 7 === 0 ? 'photo-grid__wide' : undefined}
                target="_blank"
                rel="noreferrer"
                key={image.src}
              >
                <ResponsiveImage image={image} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-band">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">Massanfertigung anfragen</span>
          <h2>Zeigen Sie uns Ihre Komponente.</h2>
          <Link className="button button--light" to="/kontakt">
            Projekt beschreiben <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
