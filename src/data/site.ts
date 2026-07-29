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
  { to: '/kontakt', label: 'Kontakt' },
] as const

const gallery = (slug: keyof typeof mediaBySlug): GalleryImage[] =>
  mediaBySlug[slug].map((image) => ({ ...image }))

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
    featuredImage: images[0],
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

export const featuredReferences = solutions.flatMap((solution) =>
  solution.gallery.slice(0, 3),
)

export function solutionBySlug(slug?: string) {
  return solutions.find(
    (solution) => solution.slug === slug || solution.productSlug === slug,
  )
}

export const productPath = (solution: Solution) =>
  `/produkte/${solution.productSlug}`
