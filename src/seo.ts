import {
  company,
  heroImage,
  productPath,
  solutionBySlug,
  solutions,
} from './data/site'

export const siteOrigin = 'https://isomat.ch'

export type RouteSeo = {
  path: string
  title: string
  description: string
  image: string
  type?: 'website' | 'product'
  noindex?: boolean
  crumb?: string
}

const staticRoutes: RouteSeo[] = [
  {
    path: '/',
    title: 'IsoMat GmbH | Industrielle Dämmkissen nach Mass',
    description:
      'Massgefertigte, abnehmbare Dämmkissen und Isoliermatratzen für komplexe Industrieanlagen – entwickelt und gefertigt in Spreitenbach.',
    image: '/og.png',
  },
  {
    path: '/loesungen',
    title: 'Ventile & Armaturen isolieren | IsoMat GmbH',
    description:
      'Passgenaue, abnehmbare Dämmkissen für Ventile, Pumpen, Flansche und Armaturen – mit realem Vorher-Nachher-Vergleich.',
    image: '/og.png',
    crumb: 'Lösungen',
  },
  {
    path: '/ueber-uns',
    title: 'Über IsoMat | Individuelle Isoliertechnik',
    description:
      'IsoMat GmbH aus Spreitenbach fertigt massgeschneiderte Dämmkissen und flexible Isolierungssysteme – über 15 Jahre Erfahrung in der industriellen Isolierung.',
    image: '/hero-industrial.webp',
    crumb: 'Über uns',
  },
  {
    path: '/kontakt',
    title: 'Projektanfrage & Kontakt | IsoMat GmbH',
    description:
      'Beschreiben Sie Ihre Komponente und senden Sie IsoMat Fotos, Zeichnungen oder Projektdokumente für eine individuelle Anfrage.',
    image: '/og.png',
    crumb: 'Kontakt',
  },
  {
    path: '/impressum',
    title: 'Impressum | IsoMat GmbH',
    description:
      'Impressum und Kontaktangaben der IsoMat GmbH in Spreitenbach.',
    image: '/og.png',
    crumb: 'Impressum',
  },
  {
    path: '/datenschutz',
    title: 'Datenschutz | IsoMat GmbH',
    description:
      'Informationen zum Datenschutz und zur Verarbeitung von Projektanfragen auf der Website der IsoMat GmbH.',
    image: '/og.png',
    crumb: 'Datenschutz',
  },
]

export const canonicalRoutes = [
  ...staticRoutes,
  ...solutions.map<RouteSeo>((solution) => ({
    path: productPath(solution),
    title: solution.seo.title,
    description: solution.seo.description,
    image: solution.featuredImage.src,
    type: 'product',
    crumb: solution.title,
  })),
]

const cleanPath = (pathname: string) => {
  const withoutQuery = pathname.split(/[?#]/)[0] || '/'
  if (withoutQuery === '/') return '/'
  return withoutQuery.replace(/\/+$/, '')
}

export function getRouteSeo(pathname: string): RouteSeo {
  const path = cleanPath(pathname)
  const exact = canonicalRoutes.find((route) => route.path === path)
  if (exact) return exact

  if (path.startsWith('/produkte/')) {
    const solution = solutionBySlug(path.slice('/produkte/'.length))
    if (solution) {
      return canonicalRoutes.find(
        (route) => route.path === productPath(solution),
      )!
    }
  }

  return {
    path,
    title: 'Seite nicht gefunden | IsoMat GmbH',
    description: 'Die angeforderte Seite wurde nicht gefunden.',
    image: '/og.png',
    noindex: true,
  }
}

export function absoluteUrl(path: string) {
  return new URL(path, siteOrigin).toString()
}

const organization = {
  '@type': 'Organization',
  '@id': `${siteOrigin}/#organization`,
  name: company.name,
  url: siteOrigin,
  logo: absoluteUrl('/logo.png'),
  email: company.email,
  telephone: company.phoneHref,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.street,
    postalCode: '8957',
    addressLocality: 'Spreitenbach',
    addressCountry: 'CH',
  },
}

export function structuredDataForRoute(pathname: string) {
  const seo = getRouteSeo(pathname)
  const graph: Record<string, unknown>[] = [
    organization,
    {
      '@type': 'WebSite',
      '@id': `${siteOrigin}/#website`,
      url: siteOrigin,
      name: company.name,
      inLanguage: 'de-CH',
      publisher: { '@id': `${siteOrigin}/#organization` },
    },
  ]

  if (seo.path !== '/' && !seo.noindex) {
    const items =
      seo.type === 'product'
        ? [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Start',
              item: siteOrigin,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Lösungen',
              item: absoluteUrl('/loesungen'),
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: seo.crumb,
              item: absoluteUrl(seo.path),
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Start',
              item: siteOrigin,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: seo.crumb,
              item: absoluteUrl(seo.path),
            },
          ]
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: items,
    })
  }

  if (seo.type === 'product') {
    const solution = solutionBySlug(seo.path.split('/').pop())
    if (solution) {
      graph.push(
        {
          '@type': 'Product',
          name: solution.title,
          url: absoluteUrl(seo.path),
          description: solution.summary,
          image: solution.gallery.slice(0, 4).map((image) => absoluteUrl(image.src)),
          category: 'Industrielle Isoliertechnik',
          brand: { '@type': 'Brand', name: company.name },
          manufacturer: { '@id': `${siteOrigin}/#organization` },
        },
        {
          '@type': 'FAQPage',
          mainEntity: solution.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      )
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

/*
 * Das Heldenbild wird sonst erst entdeckt, wenn das Markup geparst ist – als
 * grösstes Element über dem Falz bestimmt es aber, wann die Startseite als
 * geladen gilt. Der Preload zieht es an den Anfang der Warteschlange.
 *
 * Nur die Startseite braucht das von Hand: Auf den Produktseiten steht das
 * Aufmacherbild als einfaches <img> und React stellt den Preload selbst
 * voran. Im Helden steckt es in einem <picture> (die Verlaufsmaske hängt als
 * Pseudo-Element daran) – dort hält React sich zurück, weil es die gewählte
 * Quelle nicht kennt.
 *
 * Die Kandidaten müssen mit dem <img> übereinstimmen, sonst lädt der Browser
 * zwei Fassungen desselben Motivs.
 */
function renderLcpPreload(pathname: string) {
  if (pathname !== '/') return ''
  return `<link rel="preload" as="image" href="${heroImage.src}" imagesrcset="${heroImage.srcSet}" imagesizes="${heroImage.sizes}" fetchpriority="high">`
}

export function renderSeoHead(pathname: string) {
  const seo = getRouteSeo(pathname)
  const canonical = absoluteUrl(seo.path)
  const image = absoluteUrl(seo.image)
  const robots = seo.noindex ? 'noindex, nofollow' : 'index, follow'
  const schema = JSON.stringify(structuredDataForRoute(pathname)).replaceAll(
    '<',
    '\\u003c',
  )

  return [
    renderLcpPreload(pathname),
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<link rel="alternate" hreflang="de-CH" href="${canonical}">`,
    `<link rel="alternate" hreflang="x-default" href="${canonical}">`,
    `<meta property="og:locale" content="de_CH">`,
    `<meta property="og:type" content="${seo.type ?? 'website'}">`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<script type="application/ld+json">${schema}</script>`,
  ].join('\n    ')
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
