export type DomeImageItem = string | { src: string; alt?: string }

export type DomeItem = {
  src: string
  alt: string
  x: number
  y: number
  sizeX: number
  sizeY: number
}

export function buildDomeItems(pool: DomeImageItem[], segments: number): DomeItem[] {
  const xColumns = Array.from(
    { length: segments },
    (_, index) => -37 + index * 2,
  )
  const evenRows = [-4, -2, 0, 2, 4]
  const oddRows = [-3, -1, 1, 3, 5]
  const coordinates = xColumns.flatMap((x, column) => {
    const rows = column % 2 === 0 ? evenRows : oddRows
    return rows.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }))
  })

  if (pool.length === 0) {
    return coordinates.map((coordinate) => ({
      ...coordinate,
      src: '',
      alt: '',
    }))
  }
  if (pool.length > coordinates.length) {
    console.warn(
      `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${coordinates.length}). Some images will not be shown.`,
    )
  }

  const images = pool.slice(0, coordinates.length).map((image) =>
    typeof image === 'string'
      ? { src: image, alt: '' }
      : { src: image.src || '', alt: image.alt || '' },
  )

  // Freie Plätze gleichmässig verteilen, statt Fotos zu wiederholen.
  return images.map((image, index) => ({
    ...coordinates[Math.floor((index * coordinates.length) / images.length)],
    ...image,
  }))
}
