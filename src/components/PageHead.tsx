import { Link } from 'react-router-dom'
import BlurText from './BlurText'
import { useLanguage } from '../i18n'

type PageHeadProps = {
  title: string
  index?: string
  lead?: string
  crumb?: string
  /** Nur die Überschrift, ohne Brotkrumen, Nummer und Lead. */
  compact?: boolean
}

export function PageHead({ index, title, lead, crumb, compact = false }: PageHeadProps) {
  const { pick } = useLanguage()
  return (
    <section className={compact ? 'page-head page-head--compact' : 'page-head'}>
      <div className="shell">
        {crumb && (
          <nav className="crumbs" aria-label={pick('Brotkrumen', 'Breadcrumbs')}>
            <Link to="/">{pick('Start', 'Home')}</Link>
            <span aria-hidden="true">/</span>
            <span>{crumb}</span>
          </nav>
        )}
        {index && <span className="eyebrow">{index}</span>}
        <BlurText as="h1" className="page-head__title" text={title} />
        {lead && <p className="page-head__lead">{lead}</p>}
      </div>
    </section>
  )
}
