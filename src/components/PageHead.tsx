import { Link } from 'react-router-dom'
import BlurText from './BlurText'

type PageHeadProps = {
  index: string
  title: string
  lead: string
  crumb: string
}

export function PageHead({ index, title, lead, crumb }: PageHeadProps) {
  return (
    <section className="page-head">
      <div className="shell">
        <nav className="crumbs" aria-label="Brotkrumen">
          <Link to="/">Start</Link>
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
