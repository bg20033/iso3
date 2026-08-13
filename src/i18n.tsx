/* oxlint-disable react/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  coreBenefits,
  generalFaqs,
  processSteps,
  solutions,
  type FaqEntry,
  type Solution,
} from './data/site'

export type Language = 'de' | 'en'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  pick: (de: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'de',
  setLanguage: () => undefined,
  pick: (de) => de,
})
const STORAGE_KEY = 'isomat-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  /* Keep SSR and the first client render identical; German is the default. */
  const [language, setLanguage] = useState<Language>('de')
  const mountedRef = useRef(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en') setLanguage('en')
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === 'de' ? 'de-CH' : 'en'
    if (mountedRef.current) {
      window.localStorage.setItem(STORAGE_KEY, language)
    } else {
      mountedRef.current = true
    }
  }, [language])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      pick: (de, en) => (language === 'de' ? de : en),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

type SolutionCopy = Pick<
  Solution,
  | 'title'
  | 'shortTitle'
  | 'eyebrow'
  | 'summary'
  | 'paragraphs'
  | 'benefits'
  | 'applications'
  | 'faqs'
>

const englishSolutions: Record<Solution['slug'], SolutionCopy> = {
  'ventile-armaturen': {
    title: 'Valves & Fittings',
    shortTitle: 'Valves',
    eyebrow: 'Direct access, permanently insulated',
    summary: 'Custom-fit insulation jackets for valves, pumps, flanges and fittings – removable, reusable and tailored to each system.',
    paragraphs: [
      'Every industrial system has different thermal insulation requirements. IsoMat designs and manufactures insulation jackets that fit systems, machines and components precisely.',
      'The flexible systems reduce heat loss and can be removed quickly for maintenance, inspection or repair and then reinstalled. Cut-outs for actuators, sensors and connections are integrated into the design.',
    ],
    benefits: ['Custom-made for the geometry and operating conditions', 'Quick removal and reinstallation', 'Reusable design for regular maintenance', 'Lower surface temperatures and improved contact protection'],
    applications: ['Valves', 'Fittings', 'Pumps', 'Flanges', 'Heat exchangers'],
    faqs: [],
  },
  heizungszentralen: {
    title: 'Heating Plants',
    shortTitle: 'Heating plants',
    eyebrow: 'Keep heat where it is needed',
    summary: 'Flexible insulation for pumps, valves, flanges and pipework in heating plants – maintenance-friendly and economical.',
    paragraphs: [
      'Valves, pumps, flanges and pipework in heating plants lose heat while still needing to remain accessible for inspection and repair.',
      'Custom-made insulation jackets combine reliable thermal insulation with easy handling. They can be removed quickly and refitted after the work without replacing the insulation.',
    ],
    benefits: ['Reduced heat loss at central components', 'Short maintenance and inspection interruptions', 'Reusable in new builds and modernisations', 'Improved contact protection in plant rooms'],
    applications: ['Pumps', 'Manifolds', 'Valves', 'Heat exchangers', 'Pipework'],
    faqs: [],
  },
  ascheaustragssysteme: {
    title: 'Ash Discharge & Hoppers',
    shortTitle: 'Ash discharge',
    eyebrow: 'Reliable material flow in demanding conditions',
    summary: 'Insulation for heated discharge systems, hoppers and conveyor elements, preserving heat and keeping ash dry and free-flowing.',
    paragraphs: [
      'Ash discharge systems in combustion, biomass and industrial plants are exposed to low outside temperatures and moisture. Cooling can cause deposits, blockages and unplanned downtime.',
      'IsoMat insulation jackets reduce heat loss, protect trace heating and support an even temperature throughout the discharge area. The modular elements remain removable for maintenance.',
    ],
    benefits: ['Supports trace heating and heating tapes', 'Reduces heat loss and moisture impact', 'Simplifies access to discharge components', 'Custom design for complex geometries'],
    applications: ['Hoppers', 'Slide gates', 'Rotary valves', 'Conveyor systems'],
    faqs: [],
  },
  revisionstueren: {
    title: 'Inspection Doors & Openings',
    shortTitle: 'Inspection doors',
    eyebrow: 'Safely insulated, immediately accessible',
    summary: 'Custom-fit insulation jackets for regularly opened inspection doors on boilers, furnaces, dryers and process equipment.',
    paragraphs: [
      'Inspection doors and openings need to be opened regularly for inspection, cleaning and maintenance. Permanently installed insulation is often cumbersome and can be damaged during removal.',
      'The IsoMat solution is tailored precisely to the door and its controls. Viewing ports, measurement openings and closures remain clear while surface temperature and heat loss are reduced.',
    ],
    benefits: ['Quick access without damaging the insulation', 'Cut-outs for viewing ports and controls', 'Reusable over many maintenance cycles', 'Improved contact and occupational safety'],
    applications: ['Boilers', 'Furnaces', 'Dryers', 'Combustion plants', 'Process equipment'],
    faqs: [],
  },
  kompensatoren: {
    title: 'Expansion Joints',
    shortTitle: 'Expansion joints',
    eyebrow: 'Preserve movement, close thermal bridges',
    summary: 'Flexible insulation jackets for expansion joints that allow thermal movement and vibration without compromising thermal insulation.',
    paragraphs: [
      'Expansion joints absorb thermal expansion, vibration and movement in piping systems, yet often remain a weak point in the insulation.',
      'Custom-made IsoMat jackets close this thermal bridge without restricting movement. They can be removed quickly for inspection or replacement and then reinstalled.',
    ],
    benefits: ['Unrestricted expansion-joint function', 'Suitable for axial, lateral and universal designs', 'Quickly removable for inspection and replacement', 'Reduced heat loss and surface temperatures'],
    applications: ['Axial expansion joints', 'Lateral expansion joints', 'Universal expansion joints'],
    faqs: [],
  },
  turbinen: {
    title: 'Turbines',
    shortTitle: 'Turbines',
    eyebrow: 'Modular for overhaul and operation',
    summary: 'Multi-part high-temperature insulation for steam, gas and industrial turbines with direct access to flanges, sensors and connections.',
    paragraphs: [
      'Turbines operate at high temperatures and must remain accessible for inspection and overhaul. Without effective insulation, heat loss and surface temperatures rise significantly.',
      'Each insulation system is adapted to the turbine geometry and built in modules. The individual jackets can be removed without special tools and refitted precisely after maintenance.',
    ],
    benefits: ['Modular design for fast overhauls', 'Precise cut-outs for sensors and flanges', 'Reusable without loss of insulation performance', 'Improved safety for maintenance personnel'],
    applications: ['Steam turbines', 'Gas turbines', 'Industrial turbines', 'Connecting pipework'],
    faqs: [],
  },
  sonderbau: {
    title: 'Custom Designs & Combinations',
    shortTitle: 'Custom designs',
    eyebrow: 'For geometries beyond the standard',
    summary: 'Individual insulation concepts for fans, vibrating components, complex assemblies and applications with unusual installation conditions.',
    paragraphs: [
      'Complex plant components, moving parts and tight installation spaces require a design beyond standard solutions. Materials, fastening and segmentation are matched to operating conditions.',
      'IsoMat manufactures from drawings, models or on-site measurements. Even with vibration, high temperatures or many connections, all relevant components remain accessible and safely insulated.',
    ],
    benefits: ['Designed from drawings, models or on-site measurements', 'Suitable for moving and vibrating components', 'Individual segmentation and fastening', 'For new plants, conversions and modernisations'],
    applications: ['Fans', 'Custom components', 'Assemblies', 'Combined insulation systems'],
    faqs: [],
  },
}

const englishFaqs = (title: string): FaqEntry[] => [
  { question: `Are the insulation jackets for ${title} removable?`, answer: 'Yes. The design can be removed for maintenance, inspection and repair and then reinstalled with the same precise fit.' },
  { question: 'How is the correct shape determined?', answer: 'IsoMat manufactures from drawings, models or measurements taken at the plant. Cut-outs and fasteners are integrated into the design.' },
  { question: 'What information helps with a project enquiry?', answer: 'Photos, dimensions, operating temperature and details of the required maintenance access are particularly helpful.' },
]

export function useLocalizedSite() {
  const { language } = useLanguage()
  return useMemo(() => {
    if (language === 'de') {
      return { solutions, coreBenefits, processSteps, generalFaqs }
    }
    const localizedSolutions = solutions.map((solution) => {
      const copy = englishSolutions[solution.slug]
      const localizedGallery = solution.gallery.map((image, index) => ({
        ...image,
        alt: `${copy.title} – IsoMat reference ${String(index + 1).padStart(2, '0')}`,
      }))
      return {
        ...solution,
        ...copy,
        gallery: localizedGallery,
        featuredImage: localizedGallery[0],
        problem: copy.paragraphs[0],
        approach: copy.paragraphs[1],
        faqs: englishFaqs(copy.shortTitle),
      }
    })
    return {
      solutions: localizedSolutions,
      coreBenefits: [
        { title: 'Energy efficiency', text: 'Precision-fit insulation reduces avoidable heat loss at complex components.' },
        { title: 'Easy maintenance', text: 'Removable modules provide direct access and can be reused afterwards.' },
        { title: 'Occupational safety', text: 'Lower surface temperatures provide effective contact protection.' },
        { title: 'Made to measure', text: 'Geometry, material, fasteners and cut-outs are tailored to the plant.' },
      ],
      processSteps: [
        ['01', 'Consultation', 'Clarify the application, temperature and maintenance requirements.'],
        ['02', 'Measurement', 'Capture the geometry from drawings, a model or directly at the plant.'],
        ['03', 'Design', 'Define segments, cut-outs, materials and fastening.'],
        ['04', 'Manufacturing', 'Produce every insulation jacket precisely for its application.'],
        ['05', 'Installation', 'Fit and label the elements while keeping them accessible for maintenance.'],
      ] as ReadonlyArray<readonly [string, string, string]>,
      generalFaqs: [
        { question: 'How often can an insulation jacket be removed and reinstalled?', answer: 'The jackets are designed for repeated use. Their fasteners and quilting retain the shape so the same elements can be reinstalled after an overhaul.' },
        { question: 'What does IsoMat need for a quotation?', answer: 'Photos of the installed component, key dimensions and operating temperature are the fastest starting point. Drawings or CAD files are welcome but not essential.' },
        { question: 'Are actuators, sensors and connections left accessible?', answer: 'Yes. Cut-outs for actuators, measuring points, vents and connections are defined in the design.' },
        { question: 'Can existing insulation be replaced without shutting down the plant?', answer: 'In many cases, yes, provided the component remains accessible during operation. Measurement is carried out on site and production takes place in our workshop.' },
        { question: 'How are the jackets matched to their positions after removal?', answer: 'Every element is labelled so the maintenance team can return it to the correct position.' },
      ],
    }
  }, [language])
}

export function findLocalizedSolution(
  localizedSolutions: Solution[],
  slug?: string,
) {
  return localizedSolutions.find(
    (solution) => solution.slug === slug || solution.productSlug === slug,
  )
}
