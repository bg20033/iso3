import { Link } from 'react-router-dom'
import BlurText from './BlurText'
import { useLanguage } from '../i18n'

type PageHeadProps = {
  index: string
  title: string
  lead: string
  crumb: string
  /** Flacherer Kopf, wenn der Seiteninhalt schnell erreichbar sein soll. */
  compact?: boolean
}

export function PageHead({ index, title, lead, crumb, compact = false }: PageHeadProps) {
  const { pick } = useLanguage()
  return (
    <section className={compact ? 'page-head page-head--compact' : 'page-head'}>
      <div className="shell">
        <nav className="crumbs" aria-label={pick('Brotkrumen', 'Breadcrumbs')}>
          <Link to="/">{pick('Start', 'Home')}</Link>
          <span aria-hidden="true">/</span>
          <span>{crumb}</span>
        </nav>
        <span className="eyebrow">{index}</span>
        <BlurText as="h1" className="page-head__title" text={title} />
        <p className="page-head__lead">{lead}</p>
      </div>
    </section>
  )
}
