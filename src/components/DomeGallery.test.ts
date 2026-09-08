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

  it('supports additional staggered rows', () => {
    const images = Array.from({ length: 14 }, (_, index) => ({
      src: `/image-${index + 1}.webp`,
      alt: `Image ${index + 1}`,
    }))

    const items = buildDomeItems(images, 2, 7)

    expect(items).toHaveLength(images.length)
    expect(items.filter((item) => item.x === -37).map((item) => item.y)).toEqual(
      [-6, -4, -2, 0, 2, 4, 6],
    )
    expect(items.filter((item) => item.x === -35).map((item) => item.y)).toEqual(
      [-5, -3, -1, 1, 3, 5, 7],
    )
  })
})
