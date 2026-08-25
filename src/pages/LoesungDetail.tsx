import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Maximize2 } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BlurText from '../components/BlurText'
import { Category3DExplorer } from '../components/Category3DExplorer'
import GlareHover from '../components/GlareHover'
import { ImageLightbox } from '../components/ImageLightbox'
import ReflectiveCard from '../components/ReflectiveCard'
import { ResponsiveImage } from '../components/ResponsiveImage'
import ScrollReveal from '../components/ScrollReveal'
import { SolutionSidebar } from '../components/SolutionSidebar'
import SpotlightCard from '../components/SpotlightCard'
import { useInteractiveVisuals } from '../components/useInteractiveVisuals'
import {
  productPath,
} from '../data/site'
import { findLocalizedSolution, useLanguage, useLocalizedSite } from '../i18n'

export default function LoesungDetail() {
  const { slug } = useParams()
  const { pick } = useLanguage()
  const { solutions } = useLocalizedSite()
  const solution = findLocalizedSolution(solutions, slug)
  const interactive = useInteractiveVisuals()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!solution) return <Navigate to="/nicht-gefunden" replace />
  const related = solution.relatedSlugs
    .map((relatedSlug) => findLocalizedSolution(solutions, relatedSlug))
    .filter((item) => item !== undefined)

  return (
    <>
      <section className="detail-hero">
        <div className="shell">
          <div className="detail-hero__content">
            <nav className="crumbs detail-crumbs" aria-label={pick('Brotkrumen', 'Breadcrumbs')}>
              <Link to="/">{pick('Start', 'Home')}</Link>
              <span aria-hidden="true">/</span>
              <Link to="/loesungen">{pick('Lösungen', 'Solutions')}</Link>
              <span aria-hidden="true">/</span>
              <span>{solution.shortTitle}</span>
            </nav>
            <span className="eyebrow">
              {solution.no} · {solution.eyebrow}
            </span>
            <BlurText as="h1" text={solution.title} />
            <p>{solution.summary}</p>
          </div>
          <div className="detail-hero__plate">
            <ResponsiveImage image={solution.featuredImage} eager />
            <div className="detail-hero__scan" aria-hidden="true" />
            <span className="detail-hero__code" aria-hidden="true">
              ISO · {solution.no} / {pick('MASSANFERTIGUNG', 'CUSTOM MADE')}
            </span>
          </div>
        </div>
      </section>

      <section className="section product-model-section">
        <div className="shell">
          <div className="section-heading section-heading--redesign">
            <div>
              <span className="eyebrow">3D · {pick('Aufbau', 'Design')}</span>
              <h2>{pick('Bauteil und Dämmkissen im Zusammenspiel.', 'Component and insulation working together.')}</h2>
            </div>
            <p>
              {pick('Drehen Sie das Bauteil und nehmen Sie die Isolierung ab. Die Darstellung zeigt das Konstruktionsprinzip dieser Kategorie.', 'Rotate the component and remove the insulation. The model shows the design principle for this category.')}
            </p>
          </div>
          <Category3DExplorer
            mode="single"
            solutions={[solution]}
            initialSolution={solution}
            label={`${pick('Interaktives 3D-Modell', 'Interactive 3D model')}: ${solution.title}`}
          />
        </div>
      </section>

      <section className="section section--light">
        <div className="shell solutions-layout">
          <aside className="solutions-layout__nav">
            <SolutionSidebar
              solutions={solutions}
              activeSlug={solution.slug}
              label={pick('Lösungen', 'Solutions')}
            />
          </aside>
          <div>
            <div className="detail-copy">
              <div>
                <span className="eyebrow">{pick('Anwendung', 'Application')}</span>
                <ScrollReveal>
                  {pick('Passend zur Anlage. Praktisch im Service.', 'Made for the plant. Practical in service.')}
                </ScrollReveal>
              </div>
              <div className="detail-story">
                <article className="detail-story__block">
                  <span>01 · {pick('Ausgangslage', 'Challenge')}</span>
                  <p>{solution.problem}</p>
                </article>
                <article className="detail-story__block">
                  <span>02 · {pick('IsoMat Lösung', 'IsoMat solution')}</span>
                  <p>{solution.approach}</p>
                </article>
              </div>
            </div>

            <div className="detail-benefits">
              <span className="eyebrow">{pick('Vorteile', 'Benefits')}</span>
              <div className="detail-benefit-grid">
                {solution.benefits.map((benefit, index) => (
                  <SpotlightCard
                    className="detail-benefit-card"
                    spotlightColor="rgba(214, 38, 34, 0.12)"
                    key={benefit}
                  >
                    <span>0{index + 1}</span>
                    <p>{benefit}</p>
                  </SpotlightCard>
                ))}
              </div>
            </div>

            <article className="detail-applications">
              <span className="eyebrow">{pick('Typische Komponenten', 'Typical components')}</span>
              <div className="tag-list">
                {solution.applications.map((application) => (
                  <span key={application}>{application}</span>
                ))}
              </div>
            </article>

            <section className="detail-faq" aria-labelledby="faq-title">
              <div className="detail-faq__heading">
                <span className="eyebrow">{pick('Projektwissen', 'Project knowledge')}</span>
                <h2 id="faq-title">{pick('Häufige Fragen', 'Frequently asked questions')}</h2>
              </div>
              <div className="faq-list">
                {solution.faqs.map((faq, index) => (
                  <details key={faq.question}>
                    <summary>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {faq.question}
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="section section--black">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{pick('Referenzen', 'References')}</span>
              <BlurText as="h2" text={`${pick('Einblicke', 'Examples')}: ${solution.title}`} />
            </div>
            <p>{solution.gallery.length} {pick('reale Aufnahmen aus dem IsoMat-Archiv.', 'real images from the IsoMat archive.')}</p>
          </div>
          <div className={`photo-grid${solution.slug === 'turbinen' ? ' photo-grid--paired' : ''}`}>
            {solution.gallery.map((image, index) => (
              <GlareHover
                width="100%"
                height="100%"
                background="#eceeef"
                borderRadius="0"
                borderColor="#d2d6d8"
                glareColor="#ffffff"
                glareOpacity={0.24}
                glareAngle={-38}
                glareSize={180}
                transitionDuration={700}
                key={image.src}
              >
                <button
                  type="button"
                  className="photo-card"
                  data-state-label={solution.slug === 'turbinen'
                    ? (index % 2 === 0 ? pick('Vorher', 'Before') : pick('Nachher', 'After'))
                    : undefined}
                  aria-haspopup="dialog"
                  aria-label={`${image.alt} ${pick('vergrössern', 'enlarge')}`}
                  onClick={() => setLightboxIndex(index)}
                >
                  <ResponsiveImage image={image} />
                  <span>
                    {solution.slug === 'turbinen'
                      ? `${index % 2 === 0 ? pick('Vorher', 'Before') : pick('Nachher', 'After')} · ${pick('Vergrössern', 'Enlarge')}`
                      : pick('Vergrössern', 'Enlarge')}
                    <Maximize2 aria-hidden="true" />
                  </span>
                </button>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

      <ImageLightbox
        images={solution.gallery}
        index={lightboxIndex}
        onNavigate={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />

      <section className="section section--metal related-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{pick('Verwandte Lösungen', 'Related solutions')}</span>
              <h2>{pick('Weitere Komponenten im System.', 'More components in the system.')}</h2>
            </div>
            <Link className="text-link" to="/loesungen">
              {pick('Alle Lösungen', 'All solutions')} <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <ReflectiveCard
                className="related-card"
                disabled={!interactive}
                key={item.slug}
              >
                <Link to={productPath(item)}>
                  <ResponsiveImage image={item.featuredImage} />
                  <span>{item.no}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <b>{pick('Details öffnen', 'Open details')} ↗</b>
                </Link>
              </ReflectiveCard>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-band">
        <div className="shell contact-band__inner">
          <span className="eyebrow eyebrow--light">{pick('Massanfertigung anfragen', 'Request a custom solution')}</span>
          <h2>{pick('Zeigen Sie uns Ihre Komponente.', 'Show us your component.')}</h2>
          <Link className="button button--light" to="/kontakt">
            {pick('Projekt beschreiben', 'Describe your project')} <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link className="detail-back detail-back--light" to="/loesungen">
            <ArrowLeft size={17} aria-hidden="true" /> {pick('Alle Lösungen', 'All solutions')}
          </Link>
        </div>
      </section>
    </>
  )
}
