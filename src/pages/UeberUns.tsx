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

const story = {
  de: [
    'Die IsoMat GmbH ist Ihr kompetenter Partner für massgefertigte Dämmkissen und flexible Isolierungssysteme im industriellen Bereich. In unserer Produktion in Spreitenbach, Schweiz, fertigen wir individuelle Isolierungslösungen, die präzise auf die Anforderungen unserer Kunden abgestimmt sind.',
    'Hinter IsoMat steht ein Team mit über 15 Jahren Erfahrung in der industriellen Isolierung. Dank unseres fundierten Fachwissens und unserer praxisorientierten Arbeitsweise entwickeln wir Lösungen für unterschiedlichste Anwendungen – von Rohrleitungen und Armaturen bis hin zu komplexen Industrieanlagen.',
    'Unser Leistungsspektrum umfasst massgeschneiderte Dämmkissen für Ventile, Flansche, Kompensatoren, Turbinen, Wärmetauscher, Rohrleitungen, Behälter sowie zahlreiche weitere Industriekomponenten. Jedes Produkt wird individuell geplant und mit grosser Sorgfalt gefertigt, um den technischen Anforderungen und den Wünschen unserer Kunden gerecht zu werden.',
    'Eine persönliche Beratung, eine präzise Fertigung und eine zuverlässige Lieferung bilden die Grundlage unserer täglichen Arbeit. Unser Ziel ist es, massgeschneiderte Isolierungslösungen in höchster Qualität zu liefern, die Energieverluste reduzieren, Wartungsarbeiten erleichtern und die Betriebssicherheit erhöhen.',
    'Wir verstehen uns als langfristiger Partner unserer Kunden und begleiten jedes Projekt von der ersten Beratung über die Planung bis zur fertigen Lösung. Dabei stehen Qualität, Zuverlässigkeit und Kundenzufriedenheit jederzeit im Mittelpunkt unseres Handelns.',
  ],
  en: [
    'IsoMat GmbH is your specialist partner for custom-made insulation jackets and flexible insulation systems for industrial applications. At our production facility in Spreitenbach, Switzerland, we manufacture individual insulation solutions precisely tailored to our customers’ requirements.',
    'IsoMat is backed by a team with more than 15 years of experience in industrial insulation. Our technical expertise and practical approach enable us to develop solutions for a wide range of applications – from pipework and valves to complex industrial plants.',
    'Our range includes custom-made insulation jackets for valves, flanges, expansion joints, turbines, heat exchangers, pipework, vessels and many other industrial components. Every product is individually planned and manufactured with great care to meet technical requirements and customer needs.',
    'Personal advice, precise manufacturing and reliable delivery form the basis of our daily work. Our goal is to provide high-quality, custom insulation solutions that reduce energy loss, simplify maintenance and improve operational safety.',
    'We see ourselves as a long-term partner to our customers and support every project from the initial consultation and planning through to the completed solution. Quality, reliability and customer satisfaction remain central to everything we do.',
  ],
} as const

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
            {story[language].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p><strong>{pick('IsoMat GmbH – Massgeschneiderte Isolierungslösungen für höchste Ansprüche.', 'IsoMat GmbH – Custom insulation solutions for the highest standards.')}</strong></p>
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
