import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Check, Maximize2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Solution } from '../data/site'
import { findLocalizedSolution, useLanguage, useLocalizedSite } from '../i18n'
import { ImageLightbox } from './ImageLightbox'
import { ResponsiveImage } from './ResponsiveImage'

type SolutionModalProps = {
  solution: Solution | null
  onClose: () => void
  onSelectSolution: (solution: Solution) => void
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function SolutionModal({
  solution,
  onClose,
  onSelectSolution,
}: SolutionModalProps) {
  const { pick } = useLanguage()
  const { solutions } = useLocalizedSite()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const lightboxOpenRef = useRef(false)
  lightboxOpenRef.current = lightboxIndex !== null

  /* Beim Wechsel der Lösung darf keine alte Grossansicht offen bleiben. */
  useEffect(() => {
    setLightboxIndex(null)
  }, [solution])

  useEffect(() => {
    if (!solution) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    dialogRef.current?.scrollTo?.({ top: 0 })

    const handleKeyDown = (event: KeyboardEvent) => {
      /* Liegt die Grossansicht darüber, gehört die Tastatur ihr. */
      if (lightboxOpenRef.current) return

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      )
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [onClose, solution])

  if (!solution || typeof document === 'undefined') return null
  const related = solution.relatedSlugs
    .map((slug) => findLocalizedSolution(solutions, slug))
    .filter((item): item is Solution => item !== undefined)
  const contactPath = `/kontakt?application=${encodeURIComponent(solution.title)}`

  return createPortal(
    <div
      className="solution-modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="solution-modal__dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`solution-modal-${solution.slug}`}
      >
        <header className="solution-modal__header">
          <span className="eyebrow">
            {solution.no} · {solution.eyebrow}
          </span>
          <button
            className="solution-modal__close"
            type="button"
            onClick={onClose}
            ref={closeRef}
            aria-label={pick('Dialog schliessen', 'Close dialog')}
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="solution-modal__grid">
          <figure className="solution-modal__media">
            <ResponsiveImage image={solution.featuredImage} eager />
            <figcaption>
              {solution.gallery.length} {pick('reale Referenzaufnahmen', 'real reference images')}
            </figcaption>
          </figure>

          <div className="solution-modal__content">
            <h2 id={`solution-modal-${solution.slug}`}>{solution.title}</h2>
            <p className="solution-modal__lead">{solution.summary}</p>

            <div className="solution-modal__split">
              <div>
                <span>{pick('Ausgangslage', 'Challenge')}</span>
                <p>{solution.problem}</p>
              </div>
              <div>
                <span>{pick('IsoMat-Lösung', 'IsoMat solution')}</span>
                <p>{solution.approach}</p>
              </div>
            </div>

            <ul className="solution-modal__benefits">
              {solution.benefits.map((benefit) => (
                <li key={benefit}>
                  <Check aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="solution-modal__tags">
              {solution.applications.map((application) => (
                <span key={application}>{application}</span>
              ))}
            </div>

          </div>
        </div>

        <section
          className="solution-modal__section solution-modal__gallery"
          aria-labelledby={`solution-gallery-${solution.slug}`}
        >
          <div className="solution-modal__section-heading">
            <div>
              <span className="eyebrow">{pick('Referenzen', 'References')}</span>
              <h3 id={`solution-gallery-${solution.slug}`}>
                {pick('Einblicke', 'Examples')}: {solution.title}
              </h3>
            </div>
            <p>
              {solution.gallery.length} {pick('reale Aufnahmen aus dem IsoMat-Archiv.', 'real images from the IsoMat archive.')}
            </p>
          </div>
          <div className="solution-modal__photo-grid">
            {solution.gallery.map((image, index) => (
              <button
                type="button"
                className="solution-modal__photo"
                aria-haspopup="dialog"
                aria-label={`${image.alt} ${pick('vergrössern', 'enlarge')}`}
                onClick={() => setLightboxIndex(index)}
                key={image.src}
              >
                <ResponsiveImage image={image} />
                <span>
                  {String(index + 1).padStart(2, '0')} · {pick('Vergrössern', 'Enlarge')}
                  <Maximize2 aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          className="solution-modal__section solution-modal__faq"
          aria-labelledby={`solution-faq-${solution.slug}`}
        >
          <div className="solution-modal__section-heading">
            <div>
              <span className="eyebrow">{pick('Projektwissen', 'Project knowledge')}</span>
              <h3 id={`solution-faq-${solution.slug}`}>{pick('Häufige Fragen', 'Frequently asked questions')}</h3>
            </div>
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

        <section className="solution-modal__section solution-modal__related">
          <div className="solution-modal__section-heading">
            <div>
              <span className="eyebrow">{pick('Verwandte Lösungen', 'Related solutions')}</span>
              <h3>{pick('Weitere Komponenten im System.', 'More components in the system.')}</h3>
            </div>
          </div>
          <div className="solution-modal__related-grid">
            {related.map((item) => (
              <button
                type="button"
                onClick={() => onSelectSolution(item)}
                key={item.slug}
              >
                <ResponsiveImage image={item.featuredImage} />
                <span>{item.no}</span>
                <strong>{item.title}</strong>
                <small>{pick('Im Modal öffnen', 'Open in modal')} ↗</small>
              </button>
            ))}
          </div>
        </section>

        <footer className="solution-modal__footer">
          <div>
            <span className="eyebrow eyebrow--light">
              {pick('Massanfertigung anfragen', 'Request a custom solution')}
            </span>
            <h3>{pick('Zeigen Sie uns Ihre Komponente.', 'Show us your component.')}</h3>
          </div>
          <Link className="button button--light" to={contactPath}>
            {pick('Projekt beschreiben', 'Describe your project')}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <button type="button" onClick={onClose}>
            {pick('Schliessen', 'Close')}
          </button>
        </footer>
      </div>

      <ImageLightbox
        images={solution.gallery}
        index={lightboxIndex}
        onNavigate={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
        layer="over-modal"
      />
    </div>,
    document.body,
  )
}
