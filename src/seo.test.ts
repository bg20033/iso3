import { describe, expect, it } from 'vitest'
import {
  canonicalRoutes,
  getRouteSeo,
  requestedSearchTerms,
  renderSeoHead,
  structuredDataForRoute,
} from './seo'

describe('SEO route manifest', () => {
  it('contains unique canonical routes and metadata', () => {
    expect(new Set(canonicalRoutes.map((route) => route.path)).size).toBe(
      canonicalRoutes.length,
    )
    expect(new Set(canonicalRoutes.map((route) => route.title)).size).toBe(
      canonicalRoutes.length,
    )
    for (const route of canonicalRoutes) {
      expect(route.description.length).toBeGreaterThan(60)
      expect(renderSeoHead(route.path)).toContain(
        `https://isomat.ch${route.path === '/' ? '/' : route.path}`,
      )
    }
  })

  it('adds Product, Breadcrumb and FAQ data without fabricated offers', () => {
    const schema = structuredDataForRoute('/produkte/turbinen')
    const serialized = JSON.stringify(schema)
    expect(serialized).toContain('"Product"')
    expect(serialized).toContain('"BreadcrumbList"')
    expect(serialized).toContain('"FAQPage"')
    expect(serialized).not.toContain('"offers"')
    expect(serialized).not.toContain('"review"')
  })

  it('describes the company contact and each indexable page', () => {
    const schema = structuredDataForRoute('/kontakt')
    const serialized = JSON.stringify(schema)
    expect(serialized).toContain('"ContactPoint"')
    expect(serialized).toContain('"ContactPage"')
    expect(serialized).toContain('"availableLanguage":["de","en"]')
  })

  it('covers every requested insulation search term on the solutions page', () => {
    const seo = getRouteSeo('/loesungen')
    const head = renderSeoHead('/loesungen')
    const schema = JSON.stringify(structuredDataForRoute('/loesungen'))

    expect(new Set(seo.keywords ?? [])).toEqual(new Set(requestedSearchTerms))
    for (const term of requestedSearchTerms) {
      expect(head).toContain(term)
      expect(schema).toContain(term)
    }
  })

  it('marks unknown routes as noindex', () => {
    expect(getRouteSeo('/unbekannt')).toMatchObject({ noindex: true })
  })
})
