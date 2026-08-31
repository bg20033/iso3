import { describe, expect, it } from 'vitest'
import { company, featuredReferences, solutions } from './site'

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

  it('fills the globe with every unique insulated reference and no before images', () => {
    const expectedSources = new Set(
      solutions.flatMap((solution) =>
        solution.slug === 'turbinen'
          ? solution.gallery
              .filter((_, index) => index % 2 === 1)
              .map((image) => image.src)
          : solution.gallery.map((image) => image.src),
      ),
    )
    const globeSources = featuredReferences.map((image) => image.src)

    expect(new Set(globeSources).size).toBe(globeSources.length)
    expect(new Set(globeSources)).toEqual(expectedSources)
    expect(globeSources.some((src) => src.includes('-before-'))).toBe(false)
    expect(
      globeSources.filter((src) => src.includes('/references/turbines/')),
    ).toHaveLength(7)
  })
})
