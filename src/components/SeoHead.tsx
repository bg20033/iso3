import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  absoluteUrl,
  getRouteSeo,
  structuredDataForRoute,
} from '../seo'

const setMeta = (
  selector: string,
  attributes: Record<string, string>,
) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.dataset.isomatSeo = 'true'
    document.head.append(element)
  }
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value)
  }
}

const setLink = (hreflang?: string) => {
  const selector = hreflang
    ? `link[rel="alternate"][hreflang="${hreflang}"]`
    : 'link[rel="canonical"]'
  let element = document.head.querySelector<HTMLLinkElement>(selector)
  if (!element) {
    element = document.createElement('link')
    element.dataset.isomatSeo = 'true'
    element.rel = hreflang ? 'alternate' : 'canonical'
    if (hreflang) element.hreflang = hreflang
    document.head.append(element)
  }
  return element
}

export function SeoHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = getRouteSeo(pathname)
    const canonical = absoluteUrl(seo.path)
    const image = absoluteUrl(seo.image)
    document.title = seo.title

    setMeta('meta[name="description"]', {
      name: 'description',
      content: seo.description,
    })
    setMeta('meta[name="robots"]', {
      name: 'robots',
      content: seo.noindex ? 'noindex, nofollow' : 'index, follow',
    })
    setMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: seo.type ?? 'website',
    })
    setMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: seo.title,
    })
    setMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: seo.description,
    })
    setMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonical,
    })
    setMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: image,
    })
    setMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: seo.title,
    })
    setMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: seo.description,
    })
    setMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: image,
    })

    setLink().href = canonical
    setLink('de-CH').href = canonical
    setLink('x-default').href = canonical

    let schema = document.head.querySelector<HTMLScriptElement>(
      'script[data-isomat-schema]',
    )
    if (!schema) {
      schema = document.createElement('script')
      schema.type = 'application/ld+json'
      schema.dataset.isomatSchema = 'true'
      document.head.append(schema)
    }
    schema.textContent = JSON.stringify(structuredDataForRoute(pathname))
  }, [pathname])

  return null
}
