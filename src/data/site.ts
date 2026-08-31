import { mediaBySlug } from './media.generated'

export type GalleryImage = {
  src: string
  thumb: string
  alt: string
  width: number
  height: number
}

export type Solution = {
  no: string
  slug: keyof typeof mediaBySlug
  productSlug: string
  title: string
  shortTitle: string
  eyebrow: string
  summary: string
  paragraphs: string[]
  problem: string
  approach: string
  benefits: string[]
  applications: string[]
  seo: {
    title: string
    description: string
    primaryKeyword: string
    secondaryKeywords: string[]
  }
  faqs: {
    question: string
    answer: string
  }[]
  relatedSlugs: (keyof typeof mediaBySlug)[]
  gallery: GalleryImage[]
  featuredImage: GalleryImage
}

export const company = {
  name: 'IsoMat GmbH',
  street: 'Kesselstrasse 11',
  city: '8957 Spreitenbach',
  phone: '056 245 16 28',
  phoneHref: '+41562451628',
  email: 'info@isomat.ch',
} as const

export const nav = [
  { to: '/', label: 'Start' },
  { to: '/loesungen', label: 'Lösungen' },
  { to: '/ueber-uns', label: 'Über uns' },
  { to: '/referenzen', label: 'Referenzen' },
  { to: '/kontakt', label: 'Kontakt' },
] as const

export const referenceImages: GalleryImage[] = [
  ['01-before', 1280, 960],
  ['01-after', 1280, 960],
  ['02-before', 1280, 958],
  ['02-after', 1280, 958],
  ['03-before', 1280, 960],
  ['03-after', 1280, 960],
  ['04-before', 1280, 960],
  ['04-after', 1024, 768],
  ['05-before', 1280, 957],
  ['05-after', 1280, 958],
  ['06-before', 1280, 957],
  ['06-after', 1280, 960],
  ['07-before', 1280, 962],
  ['07-after', 1086, 1449],
].map(([name, width, height], index) => {
  const pair = Math.floor(index / 2) + 1
  const isBefore = index % 2 === 0
  return {
    src: `/media/references/turbines/${name}-1280.webp`,
    thumb: `/media/references/turbines/${name}-480.webp`,
    alt: `${isBefore ? 'Ungedämmte' : 'Gedämmte'} Turbinenanlage – Referenzpaar ${String(pair).padStart(2, '0')}`,
    width: Number(width),
    height: Number(height),
  }
})

const replacedValveImages = new Set([
  '01-1280.webp',
  '09-1280.webp',
  '10-1280.webp',
  '11-1280.webp',
  '13-1280.webp',
  '16-1280.webp',
])

const valveReplacements = [0, 1, 2, 5, 6, 8].map((index) => ({
  ...mediaBySlug.heizungszentralen[index],
  alt: `Dämmkissen an Ventilen und Armaturen – Ersatzreferenz ${String(index + 1).padStart(2, '0')}`,
}))

const gallery = (slug: keyof typeof mediaBySlug): GalleryImage[] => {
  if (slug === 'turbinen') return referenceImages.map((image) => ({ ...image }))

  if (slug === 'ventile-armaturen') {
    let replacementIndex = 0
    return mediaBySlug[slug].map((image) => {
      const shouldReplace = [...replacedValveImages].some((name) => image.src.endsWith(name))
      return shouldReplace
        ? { ...valveReplacements[replacementIndex++] }
        : { ...image }
    })
  }

  return mediaBySlug[slug].map((image) => ({ ...image }))
}

type SolutionSlug = keyof typeof mediaBySlug

const solutionMeta: Record<
  SolutionSlug,
  Pick<Solution, 'productSlug' | 'seo' | 'relatedSlugs'>
> = {
  'ventile-armaturen': {
    productSlug: 'ventile',
    seo: {
      title: 'Dämmkissen für Ventile & Armaturen | IsoMat',
      description:
        'Massgefertigte, abnehmbare Dämmkissen für Ventile, Pumpen, Flansche und Armaturen in Industrieanlagen.',
      primaryKeyword: 'Dämmkissen Ventile',
      secondaryKeywords: [
        'Armaturen isolieren',
        'abnehmbare Ventilisolierung',
        'Isoliermatratzen Flansche',
      ],
    },
    relatedSlugs: ['heizungszentralen', 'kompensatoren', 'sonderbau'],
  },
  heizungszentralen: {
    productSlug: 'heizungszentralen',
    seo: {
      title: 'Isolierung für Heizungszentralen | IsoMat',
      description:
        'Wartungsfreundliche Dämmkissen für Pumpen, Ventile, Flansche und Rohrleitungen in Heizungszentralen.',
      primaryKeyword: 'Isolierung Heizungszentrale',
      secondaryKeywords: [
        'Dämmkissen Heizzentrale',
        'Pumpen isolieren',
        'Wärmeverluste Armaturen',
      ],
    },
    relatedSlugs: ['ventile-armaturen', 'revisionstueren', 'sonderbau'],
  },
  ascheaustragssysteme: {
    productSlug: 'ascheaustragssysteme',
    seo: {
      title: 'Isolierung für Ascheaustrag & Trichter | IsoMat',
      description:
        'Passgenaue Isolierungen für beheizte Ascheaustragssysteme, Trichter, Schieber und Förderelemente.',
      primaryKeyword: 'Ascheaustrag Isolierung',
      secondaryKeywords: [
        'Trichter isolieren',
        'Begleitheizung schützen',
        'Dämmkissen Fördersystem',
      ],
    },
    relatedSlugs: ['revisionstueren', 'sonderbau', 'ventile-armaturen'],
  },
  revisionstueren: {
    productSlug: 'revisionstueren',
    seo: {
      title: 'Dämmkissen für Revisionstüren | IsoMat',
      description:
        'Abnehmbare Dämmkissen für Revisionstüren und Öffnungen an Kesseln, Öfen, Trocknern und Prozessanlagen.',
      primaryKeyword: 'Dämmkissen Revisionstüren',
      secondaryKeywords: [
        'Revisionsöffnung isolieren',
        'Kessel Isolation',
        'abnehmbare Ofenisolierung',
      ],
    },
    relatedSlugs: ['ascheaustragssysteme', 'turbinen', 'sonderbau'],
  },
  kompensatoren: {
    productSlug: 'kompensatoren',
    seo: {
      title: 'Flexible Dämmkissen für Kompensatoren | IsoMat',
      description:
        'Massgefertigte Wärmedämmung für axiale, laterale und universale Kompensatoren – flexibel und abnehmbar.',
      primaryKeyword: 'Kompensator Isolierung',
      secondaryKeywords: [
        'Dämmkissen Kompensatoren',
        'flexible Rohrleitungsisolierung',
        'Wärmebrücke Kompensator',
      ],
    },
    relatedSlugs: ['ventile-armaturen', 'turbinen', 'sonderbau'],
  },
  turbinen: {
    productSlug: 'turbinen',
    seo: {
      title: 'Hochtemperatur-Isolierung für Turbinen | IsoMat',
      description:
        'Mehrteilige, abnehmbare Isoliermatratzen für Dampf-, Gas- und Industrieturbinen sowie Anschlussleitungen.',
      primaryKeyword: 'Turbinen Isolierung',
      secondaryKeywords: [
        'Hochtemperatur Dämmkissen',
        'Isoliermatratzen Dampfturbine',
        'abnehmbare Turbinenisolierung',
      ],
    },
    relatedSlugs: ['kompensatoren', 'revisionstueren', 'sonderbau'],
  },
  sonderbau: {
    productSlug: 'sonderbau',
    seo: {
      title: 'Sonderisolierungen nach Mass | IsoMat',
      description:
        'Individuelle Dämmkonzepte für komplexe, bewegliche oder vibrierende Industriekomponenten und besondere Einbausituationen.',
      primaryKeyword: 'Sonderisolierung Industrie',
      secondaryKeywords: [
        'Dämmkissen Sonderanfertigung',
        'industrielle Isolierung nach Mass',
        'Kombinationsisolierung',
      ],
    },
    relatedSlugs: ['ventile-armaturen', 'turbinen', 'ascheaustragssysteme'],
  },
}

const makeSolution = (
  value: Omit<
    Solution,
    | 'gallery'
    | 'featuredImage'
    | 'productSlug'
    | 'seo'
    | 'faqs'
    | 'relatedSlugs'
    | 'problem'
    | 'approach'
  >,
): Solution => {
  const images = gallery(value.slug)
  const meta = solutionMeta[value.slug]
  return {
    ...value,
    ...meta,
    problem: value.paragraphs[0],
    approach: value.paragraphs[1],
    faqs: [
      {
        question: `Sind die Dämmkissen für ${value.shortTitle} abnehmbar?`,
        answer:
          'Ja. Die Konstruktion ist für Wartung, Inspektion und Reparatur demontierbar und kann danach wieder passgenau montiert werden.',
      },
      {
        question: 'Wie wird die passende Form bestimmt?',
        answer:
          'IsoMat fertigt anhand von Zeichnungen, Modellen oder einem Aufmass an der Anlage. Aussparungen und Befestigungen werden in die Konstruktion integriert.',
      },
      {
        question: 'Welche Angaben helfen bei einer Projektanfrage?',
        answer:
          'Hilfreich sind Fotos, Abmessungen, Betriebstemperatur und Angaben zum benötigten Wartungszugang.',
      },
    ],
    gallery: images,
    featuredImage: value.slug === 'turbinen' ? images[1] : images[0],
  }
}

export const solutions: Solution[] = [
  makeSolution({
    no: '01',
    slug: 'ventile-armaturen',
    title: 'Ventile & Armaturen',
    shortTitle: 'Ventile',
    eyebrow: 'Direkter Zugang, dauerhaft gedämmt',
    summary:
      'Passgenaue Dämmkissen für Ventile, Pumpen, Flansche und Armaturen – abnehmbar, wiederverwendbar und auf die jeweilige Anlage abgestimmt.',
    paragraphs: [
      'Jede Industrieanlage stellt andere Anforderungen an die Wärmedämmung. IsoMat entwickelt und fertigt Dämmkissen und Isoliermatratzen, die exakt auf Anlagen, Maschinen und Komponenten abgestimmt sind.',
      'Die flexiblen Systeme reduzieren Wärmeverluste und lassen sich für Wartung, Inspektion oder Reparatur schnell entfernen und wieder montieren. Aussparungen für Antriebe, Sensoren und Anschlüsse werden direkt in die Konstruktion integriert.',
    ],
    benefits: [
      'Individuelle Fertigung nach Geometrie und Betriebsbedingungen',
      'Schnelle Demontage und Wiedermontage',
      'Wiederverwendbare Konstruktion für regelmässige Wartung',
      'Reduzierte Oberflächentemperaturen und besserer Berührungsschutz',
    ],
    applications: ['Ventile', 'Armaturen', 'Pumpen', 'Flansche', 'Wärmetauscher'],
  }),
  makeSolution({
    no: '02',
    slug: 'heizungszentralen',
    title: 'Heizungszentralen',
    shortTitle: 'Heizzentralen',
    eyebrow: 'Wärme dort halten, wo sie gebraucht wird',
    summary:
      'Flexible Isolierungen für Pumpen, Ventile, Flansche und Rohrleitungen in Heizungszentralen – wartungsfreundlich und wirtschaftlich.',
    paragraphs: [
      'In Heizungszentralen entstehen über Armaturen, Pumpen, Ventile, Flansche und Rohrleitungen Wärmeverluste. Gleichzeitig müssen diese Komponenten für Prüf- und Reparaturarbeiten zugänglich bleiben.',
      'Massgefertigte Dämmkissen verbinden zuverlässige Wärmedämmung mit einfacher Handhabung. Sie lassen sich in kurzer Zeit demontieren und nach der Arbeit wieder anbringen, ohne dass die Dämmung ersetzt werden muss.',
    ],
    benefits: [
      'Geringere Wärmeverluste an zentralen Komponenten',
      'Kurze Unterbrechungen bei Wartung und Inspektion',
      'Wiederverwendbar bei Neubau und Modernisierung',
      'Verbesserter Berührungsschutz im Anlagenraum',
    ],
    applications: ['Pumpen', 'Verteiler', 'Ventile', 'Wärmetauscher', 'Rohrleitungen'],
  }),
  makeSolution({
    no: '03',
    slug: 'ascheaustragssysteme',
    title: 'Ascheaustrag & Trichter',
    shortTitle: 'Ascheaustrag',
    eyebrow: 'Zuverlässiger Materialfluss bei anspruchsvollen Bedingungen',
    summary:
      'Isolierungen für beheizte Austragssysteme, Trichter und Förderelemente, damit Wärme erhalten und Asche trocken und fliessfähig bleibt.',
    paragraphs: [
      'Ascheaustragssysteme in Verbrennungs-, Biomasse- und Industrieanlagen sind niedrigen Aussentemperaturen und Feuchtigkeit ausgesetzt. Kühlt das Material ab, können Anbackungen, Verstopfungen und ungeplante Stillstände entstehen.',
      'IsoMat-Dämmkissen reduzieren Wärmeverluste, schützen Begleitheizungen und unterstützen eine gleichmässige Temperatur im gesamten Austragsbereich. Die modularen Elemente bleiben für Wartungsarbeiten abnehmbar.',
    ],
    benefits: [
      'Unterstützt Begleitheizungen und Heizbänder',
      'Reduziert Wärmeverluste und Feuchtigkeitseinfluss',
      'Erleichtert den Zugang zu Austragskomponenten',
      'Individuelle Ausführung für komplexe Geometrien',
    ],
    applications: ['Trichter', 'Schieber', 'Zellenradschleusen', 'Fördersysteme'],
  }),
  makeSolution({
    no: '04',
    slug: 'revisionstueren',
    title: 'Revisionstüren & Öffnungen',
    shortTitle: 'Revisionstüren',
    eyebrow: 'Sicher isoliert, sofort zugänglich',
    summary:
      'Passgenaue Dämmkissen für regelmässig geöffnete Revisionstüren an Kesseln, Öfen, Trocknern und Prozessanlagen.',
    paragraphs: [
      'Revisionstüren und Revisionsöffnungen müssen für Inspektion, Reinigung und Wartung regelmässig geöffnet werden. Fest installierte Isolierungen sind dafür oft zu aufwendig und werden beim Entfernen beschädigt.',
      'Die IsoMat-Lösung wird exakt an die Tür und ihre Bedienelemente angepasst. Sichtfenster, Messöffnungen und Verschlüsse bleiben frei, während die Oberflächentemperatur und der Wärmeverlust reduziert werden.',
    ],
    benefits: [
      'Schneller Zugang ohne Beschädigung der Dämmung',
      'Aussparungen für Sichtfenster und Bedienelemente',
      'Wiederverwendbar über viele Wartungszyklen',
      'Verbesserter Berührungs- und Arbeitsschutz',
    ],
    applications: ['Kessel', 'Öfen', 'Trockner', 'Feuerungsanlagen', 'Prozessanlagen'],
  }),
  makeSolution({
    no: '05',
    slug: 'kompensatoren',
    title: 'Kompensatoren',
    shortTitle: 'Kompensatoren',
    eyebrow: 'Beweglichkeit erhalten, Wärmebrücken schliessen',
    summary:
      'Flexible Dämmkissen für Kompensatoren, die thermische Bewegung und Schwingung zulassen, ohne auf Wärmedämmung zu verzichten.',
    paragraphs: [
      'Kompensatoren gleichen thermische Ausdehnung, Schwingungen und Bewegungen in Rohrleitungssystemen aus. Gleichzeitig bleiben sie häufig eine Schwachstelle in der Wärmedämmung.',
      'Massgefertigte IsoMat-Dämmkissen schliessen diese Wärmebrücke, ohne die Beweglichkeit des Kompensators einzuschränken. Für Inspektion oder Austausch lassen sie sich schnell entfernen und wieder montieren.',
    ],
    benefits: [
      'Uneingeschränkte Funktion des Kompensators',
      'Passend für axiale, laterale und universale Bauformen',
      'Schnell abnehmbar für Kontrolle und Austausch',
      'Reduzierte Wärmeverluste und Oberflächentemperaturen',
    ],
    applications: ['Axialkompensatoren', 'Lateralkompensatoren', 'Universalkompensatoren'],
  }),
  makeSolution({
    no: '06',
    slug: 'turbinen',
    title: 'Turbinen',
    shortTitle: 'Turbinen',
    eyebrow: 'Modular für Revision und Betrieb',
    summary:
      'Mehrteilige Hochtemperatur-Isolierungen für Dampf-, Gas- und Industrieturbinen mit direktem Zugang zu Flanschen, Sensoren und Anschlüssen.',
    paragraphs: [
      'Turbinen arbeiten unter hohen Temperaturen und müssen für Inspektionen und Revisionen zugänglich bleiben. Ohne leistungsfähige Wärmedämmung steigen Wärmeverluste und Oberflächentemperaturen deutlich.',
      'Jede Isolierung wird an die Geometrie der Turbine angepasst und modular aufgebaut. Die einzelnen Dämmkissen können ohne Spezialwerkzeug demontiert und nach der Wartung wieder passgenau montiert werden.',
    ],
    benefits: [
      'Modularer Aufbau für schnelle Revisionen',
      'Passgenaue Aussparungen für Sensoren und Flansche',
      'Wiederverwendbar ohne Verlust der Dämmwirkung',
      'Verbesserte Sicherheit für Wartungspersonal',
    ],
    applications: ['Dampfturbinen', 'Gasturbinen', 'Industrieturbinen', 'Anschlussleitungen'],
  }),
  makeSolution({
    no: '07',
    slug: 'sonderbau',
    title: 'Sonderbau & Kombinationen',
    shortTitle: 'Sonderbau',
    eyebrow: 'Für Geometrien ausserhalb des Standards',
    summary:
      'Individuelle Dämmkonzepte für Ventilatoren, vibrierende Bauteile, komplexe Baugruppen und Anwendungen mit besonderen Einbausituationen.',
    paragraphs: [
      'Komplexe Anlagenkomponenten, bewegliche Bauteile und enge Einbausituationen verlangen eine Konstruktion, die über Standardlösungen hinausgeht. Material, Befestigung und Segmentierung werden auf die Betriebsbedingungen abgestimmt.',
      'IsoMat fertigt nach Zeichnung, Modell oder Aufmass vor Ort. Auch bei Vibration, hoher Temperatur oder vielen Anschlüssen bleiben die relevanten Komponenten zugänglich und sicher isoliert.',
    ],
    benefits: [
      'Konstruktion nach Zeichnung, Modell oder Aufmass',
      'Geeignet für bewegliche und vibrierende Komponenten',
      'Individuelle Segmentierung und Befestigung',
      'Für Neuanlagen, Umbauten und Modernisierungen',
    ],
    applications: ['Ventilatoren', 'Sonderbauteile', 'Baugruppen', 'Kombinationsisolierungen'],
  }),
]

export const processSteps = [
  ['01', 'Beratung', 'Anwendung, Temperatur und Wartungsanforderungen klären.'],
  ['02', 'Aufmass', 'Geometrie per Zeichnung, Modell oder direkt an der Anlage erfassen.'],
  ['03', 'Konstruktion', 'Segmente, Aussparungen, Material und Befestigung definieren.'],
  ['04', 'Fertigung', 'Jedes Dämmkissen passgenau und anwendungsbezogen herstellen.'],
  ['05', 'Montage', 'Elemente montieren, kennzeichnen und für spätere Wartung zugänglich halten.'],
] as const

export const coreBenefits = [
  {
    title: 'Energieeffizienz',
    text: 'Passgenaue Dämmung reduziert vermeidbare Wärmeverluste an komplexen Komponenten.',
  },
  {
    title: 'Wartungsfreundlich',
    text: 'Abnehmbare Module schaffen direkten Zugang und können danach wiederverwendet werden.',
  },
  {
    title: 'Arbeitssicherheit',
    text: 'Niedrigere Oberflächentemperaturen unterstützen einen wirksamen Berührungsschutz.',
  },
  {
    title: 'Individuell gefertigt',
    text: 'Geometrie, Material, Befestigung und Aussparungen werden an die Anlage angepasst.',
  },
] as const

/**
 * Every unique, visibly insulated installation in the archive. Turbine
 * galleries alternate before/after, so only the completed (after) images
 * belong in the globe.
 */
const insulatedReferenceCandidates = solutions.flatMap((solution) =>
  solution.slug === 'turbinen'
    ? solution.gallery.filter((_, index) => index % 2 === 1)
    : solution.gallery,
)

export const featuredReferences = [
  ...new Map(
    insulatedReferenceCandidates.map((image) => [image.src, image]),
  ).values(),
]

/*
 * Das Heldenbild ist auf der Startseite das grösste Element über dem Falz und
 * bestimmt damit, wann die Seite als geladen gilt. Der Preload im <head> und
 * das <img> müssen exakt dieselben Kandidaten nennen – sonst lädt der Browser
 * zwei Fassungen desselben Motivs.
 */
export const heroImage = {
  src: '/hero-industrial.webp',
  srcSet: [
    '/hero-industrial-640.webp 640w',
    '/hero-industrial-800.webp 800w',
    '/hero-industrial-1200.webp 1200w',
    '/hero-industrial.webp 1451w',
  ].join(', '),
  sizes: '100vw',
} as const

/** Bildgrössen von ResponsiveImage – Preload und <img> müssen sich decken. */
export const responsiveImageSizes =
  '(max-width: 720px) 92vw, (max-width: 1200px) 48vw, 720px'

export const responsiveImageSrcSet = (image: GalleryImage) =>
  `${image.thumb} 480w, ${image.src} 1280w`

export type Comparison = {
  slug: SolutionSlug
  /** Unterscheidet mehrere Paare derselben Kategorie. */
  id?: string
  /** Optionale Kurzbeschreibung des gezeigten Bauteils. */
  caption?: string
  before: GalleryImage
  after: GalleryImage
}

/*
 * Vorher/Nachher-Paare.
 *
 * Es dürfen beliebig viele Einträge stehen – auch mehrere pro Kategorie.
 * Vorgehen für ein neues Paar:
 *   1. Aufnahmen unter public/media/<slug>/before-after/ ablegen
 *      (je 1280er und 640er Variante, gleicher Bildausschnitt für beide
 *      Zustände, damit der Regler sauber überblendet).
 *   2. Hier einen Eintrag ergänzen; bei mehreren Paaren pro Kategorie eine
 *      eigene `id` vergeben.
 * Alle Paare erscheinen genau einmal in einem ruhigen, statischen Raster.
 */
export const comparisons: Comparison[] = [
  {
    slug: 'ventile-armaturen',
    id: 'ventil-blau',
    caption: 'Absperrventil mit abnehmbarem Dämmkissen',
    before: {
      src: '/media/ventile/before-after/ventil-vorher-1280.webp',
      thumb: '/media/ventile/before-after/ventil-vorher-640.webp',
      alt: 'Ungedämmtes blaues Industrieventil vor der IsoMat-Ausführung',
      width: 1280,
      height: 1714,
    },
    after: {
      src: '/media/ventile/before-after/ventil-nachher-1280.webp',
      thumb: '/media/ventile/before-after/ventil-nachher-640.webp',
      alt: 'Dasselbe Industrieventil mit passgenauem IsoMat-Dämmkissen',
      width: 1280,
      height: 1714,
    },
  },
  {
    slug: 'heizungszentralen',
    id: 'rohrknoten',
    caption: 'Rohrknoten mit Flanschen und Messstelle',
    before: {
      src: '/media/heizungszentralen/before-after/rohrknoten-vorher-1280.webp',
      thumb: '/media/heizungszentralen/before-after/rohrknoten-vorher-640.webp',
      alt: 'Ungedämmter Rohrknoten mit freiliegenden Flanschen in einer Heizungszentrale',
      width: 1280,
      height: 1706,
    },
    after: {
      src: '/media/heizungszentralen/before-after/rohrknoten-nachher-1280.webp',
      thumb: '/media/heizungszentralen/before-after/rohrknoten-nachher-640.webp',
      alt: 'Derselbe Rohrknoten mit geschlossener IsoMat-Isolierung und zugänglicher Messstelle',
      width: 1280,
      height: 1706,
    },
  },
  {
    slug: 'sonderbau',
    id: 'armaturengruppe',
    caption: 'Armaturengruppe mit Kombinationsisolierung',
    before: {
      src: '/media/sonderbau/before-after/armaturengruppe-vorher-1280.webp',
      thumb: '/media/sonderbau/before-after/armaturengruppe-vorher-640.webp',
      alt: 'Ungedämmte Armaturengruppe mit Flanschen und Handrädern entlang einer Wand',
      width: 1280,
      height: 956,
    },
    after: {
      src: '/media/sonderbau/before-after/armaturengruppe-nachher-1280.webp',
      thumb: '/media/sonderbau/before-after/armaturengruppe-nachher-640.webp',
      alt: 'Dieselbe Armaturengruppe mit massgefertigten IsoMat-Sonderkissen, Handräder bleiben bedienbar',
      width: 1280,
      height: 956,
    },
  },
  {
    slug: 'ventile-armaturen',
    id: 'rohrleitungsgruppe',
    caption: 'Rohrleitungsgruppe mit passgenauen Dämmkissen',
    before: {
      ...mediaBySlug['ventile-armaturen'][0],
      alt: 'Ungedämmte Rohrleitungsgruppe vor der IsoMat-Ausführung',
    },
    after: {
      ...mediaBySlug['ventile-armaturen'][2],
      alt: 'Rohrleitungsgruppe mit montierten IsoMat-Dämmkissen',
    },
  },
  {
    slug: 'turbinen',
    id: 'turbinengehaeuse',
    caption: 'Turbinengehäuse mit mehrteiliger Isolierung',
    before: referenceImages[0],
    after: referenceImages[1],
  },
]

/** Eindeutiger Schlüssel eines Paares – auch bei mehreren pro Kategorie. */
export const comparisonKey = (comparison: Comparison) =>
  comparison.id ? `${comparison.slug}-${comparison.id}` : comparison.slug

export function solutionBySlug(slug?: string) {
  return solutions.find(
    (solution) => solution.slug === slug || solution.productSlug === slug,
  )
}

export const productPath = (solution: Solution) =>
  `/produkte/${solution.productSlug}`

export const solutionQuickviewPath = (solution: Solution) =>
  `/loesungen?solution=${encodeURIComponent(solution.productSlug)}`

/* ==========================================================================
   GEPARKT & ZU PRÜFEN – `jacketLayers` und `industries` beschreiben den
   branchenüblichen Aufbau einer Isoliermatratze und typische Einsatzfelder.
   Sie stammen NICHT aus der IsoMat-Präsentation.

   Beide Blöcke werden derzeit nirgends angezeigt: Die Bauteile, die sie
   gerendert haben (JacketDiagram, IndustryGrid), sind mit dem Redesign
   entfallen. Sie bleiben hier stehen, damit die Inhalte nicht verloren gehen
   – vor einer Wiederverwendung mit der Fertigung abgleichen.

   Achtung: `generalFaqs` weiter unten steht NICHT unter diesem Vorbehalt-
   Hinweis, ist aber ebenfalls ungeprüft und auf der Startseite sichtbar.
   Siehe docs/INHALTE-ZU-PRUEFEN.md.
   ========================================================================== */

export type JacketLayer = {
  id: string
  no: string
  title: string
  role: string
  text: string
}

/** Schichten des Dämmkissens – Beschriftung der 3D-Explosionsansicht. */
export const jacketLayers: JacketLayer[] = [
  {
    id: 'shell',
    no: '01',
    title: 'Aussenhülle',
    role: 'Schutz',
    text: 'Mechanisch belastbares Gewebe, das den Dämmkern gegen Abrieb, Feuchtigkeit und Betriebsmedien abschirmt.',
  },
  {
    id: 'core',
    no: '02',
    title: 'Dämmkern',
    role: 'Isolation',
    text: 'Temperaturbeständiges Vlies in der für die Betriebstemperatur passenden Stärke. Bestimmt Dämmwirkung und Aufbaudicke.',
  },
  {
    id: 'liner',
    no: '03',
    title: 'Innenhülle',
    role: 'Kontaktfläche',
    text: 'Liegt direkt am heissen Bauteil an und hält den Kern in Form, auch nach vielen Montagezyklen.',
  },
  {
    id: 'closure',
    no: '04',
    title: 'Verschlüsse & Steppung',
    role: 'Montage',
    text: 'Spannverschlüsse und durchgesteppte Kreuzpunkte fixieren die Segmente und verhindern ein Verrutschen des Kerns.',
  },
]

export type Industry = {
  no: string
  title: string
  text: string
  components: string[]
}

/** Einsatzfelder, abgeleitet aus den Referenzaufnahmen. */
export const industries: Industry[] = [
  {
    no: '01',
    title: 'Energie & Fernwärme',
    text: 'Heizzentralen, Verteiler und Turbinen, bei denen jeder Wärmeverlust direkt auf den Wirkungsgrad schlägt.',
    components: ['Turbinen', 'Verteiler', 'Pumpen'],
  },
  {
    no: '02',
    title: 'Verbrennung & Biomasse',
    text: 'Kessel, Trichter und Ascheaustrag – Bereiche mit Staub, Feuchtigkeit und regelmässigen Revisionen.',
    components: ['Kessel', 'Trichter', 'Zellenradschleusen'],
  },
  {
    no: '03',
    title: 'Chemie & Prozesstechnik',
    text: 'Prozessleitungen mit dichter Armaturenfolge, wo jede Komponente einzeln zugänglich bleiben muss.',
    components: ['Ventile', 'Flansche', 'Wärmetauscher'],
  },
  {
    no: '04',
    title: 'Lebensmittel & Getränke',
    text: 'Anlagen mit häufiger Reinigung und wiederkehrender Demontage der Isolierung.',
    components: ['Rohrleitungen', 'Behälter', 'Armaturen'],
  },
  {
    no: '05',
    title: 'Gebäudetechnik',
    text: 'Heizungszentralen in Gewerbe- und Industriebauten mit begrenztem Platz um die Armaturen.',
    components: ['Pumpen', 'Verteiler', 'Kompensatoren'],
  },
  {
    no: '06',
    title: 'Anlagen- & Sonderbau',
    text: 'Baugruppen ohne Standardgeometrie, die als Einzelstück aufgemessen und gefertigt werden.',
    components: ['Ventilatoren', 'Baugruppen', 'Sonderbauteile'],
  },
]

export type FaqEntry = { question: string; answer: string }

/** Allgemeine Fragen zur Isoliermatratze. */
export const generalFaqs: FaqEntry[] = [
  {
    question: 'Wie oft lässt sich ein Dämmkissen abnehmen und wieder montieren?',
    answer:
      'Die Kissen sind für den wiederkehrenden Einsatz konstruiert: Verschlüsse und Steppung halten den Aufbau in Form, sodass dieselben Elemente nach einer Revision wieder montiert werden können. Wie viele Zyklen konkret erreicht werden, hängt von Betriebsmedium, Temperatur und Handhabung ab.',
  },
  {
    question: 'Was braucht IsoMat für eine Offerte?',
    answer:
      'Am schnellsten geht es mit Fotos der eingebauten Komponente, den Hauptabmessungen und der Betriebstemperatur. Zeichnungen oder CAD-Dateien sind willkommen, aber keine Voraussetzung – oft genügt ein Aufmass vor Ort.',
  },
  {
    question: 'Werden Antriebe, Sensoren und Anschlüsse ausgespart?',
    answer:
      'Ja. Aussparungen für Stellantriebe, Messstellen, Entlüftungen und Anschlüsse werden in der Konstruktion festgelegt und nicht nachträglich ins fertige Kissen geschnitten.',
  },
  {
    question: 'Kann bestehende Dämmung ersetzt werden, ohne die Anlage abzustellen?',
    answer:
      'In vielen Fällen ja, sofern das Bauteil im Betrieb zugänglich ist. Das Aufmass erfolgt an der laufenden Anlage, die Fertigung im Werk, und die Montage beschränkt sich auf ein kurzes Zeitfenster.',
  },
  {
    question: 'Wie werden die Kissen nach der Demontage wieder zugeordnet?',
    answer:
      'Jedes Element wird gekennzeichnet. So findet das Wartungsteam nach dem Serviceeinsatz die passende Position wieder, ohne die Segmente durchprobieren zu müssen.',
  },
]
