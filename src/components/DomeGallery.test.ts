import { describe, expect, it } from 'vitest'
import { buildDomeItems } from './domeGalleryLayout'

describe('DomeGallery item layout', () => {
  it('leaves spare cells empty instead of repeating images', () => {
    const images = [
      { src: '/one.webp', alt: 'One' },
      { src: '/two.webp', alt: 'Two' },
      { src: '/three.webp', alt: 'Three' },
    ]

    const items = buildDomeItems(images, 2)

    expect(items).toHaveLength(images.length)
    expect(items.map((item) => item.src)).toEqual(
      images.map((image) => image.src),
    )
    expect(new Set(items.map((item) => `${item.x}:${item.y}`)).size).toBe(
      images.length,
    )
  })
})
