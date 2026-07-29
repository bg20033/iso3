import { describe, expect, it } from 'vitest'
import { company, solutions } from './site'

describe('site content', () => {
  it('contains seven complete solution categories with real media', () => {
    expect(solutions).toHaveLength(7)
    expect(new Set(solutions.map((solution) => solution.slug)).size).toBe(7)
    expect(new Set(solutions.map((solution) => solution.productSlug)).size).toBe(
      7,
    )

    for (const solution of solutions) {
      expect(solution.gallery.length).toBeGreaterThan(0)
      expect(solution.featuredImage.src).toMatch(/^\/media\//)
      expect(solution.benefits.length).toBeGreaterThanOrEqual(4)
      expect(solution.paragraphs.length).toBeGreaterThanOrEqual(2)
      expect(solution.faqs).toHaveLength(3)
      expect(solution.relatedSlugs).toHaveLength(3)
      expect(solution.seo.title).toContain('IsoMat')
    }
  })

  it('uses the contact details from the supplied presentation', () => {
    expect(company).toMatchObject({
      name: 'IsoMat GmbH',
      street: 'Kesselstrasse 11',
      city: '8957 Spreitenbach',
      phone: '056 245 16 28',
      email: 'info@isomat.ch',
    })
  })
})
