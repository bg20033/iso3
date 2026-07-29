import { describe, expect, it } from 'vitest'
import {
  canonicalRoutes,
  getRouteSeo,
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

  it('marks unknown routes as noindex', () => {
    expect(getRouteSeo('/unbekannt')).toMatchObject({ noindex: true })
  })
})
