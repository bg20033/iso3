import { Plus } from 'lucide-react'
import type { FaqEntry } from '../data/site'

/** Aufklappbare Fragen auf Basis von <details> – ohne JavaScript bedienbar. */
export function FaqAccordion({ entries }: { entries: FaqEntry[] }) {
  return (
    <div className="faq-accordion">
      {entries.map((entry, index) => (
        <details className="faq-item" key={entry.question}>
          <summary>
            <span className="faq-item__no">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="faq-item__question">{entry.question}</span>
            <Plus className="faq-item__icon" size={20} aria-hidden="true" />
          </summary>
          <p>{entry.answer}</p>
        </details>
      ))}
    </div>
  )
}
