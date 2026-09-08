export type DomeImageItem = string | { src: string; alt?: string }

export type DomeItem = {
  src: string
  alt: string
  x: number
  y: number
  sizeX: number
  sizeY: number
}

export function buildDomeItems(
  pool: DomeImageItem[],
  segments: number,
  rowCount = 5,
): DomeItem[] {
  const xColumns = Array.from(
    { length: segments },
    (_, index) => -37 + index * 2,
  )
  const normalizedRowCount = Math.max(1, Math.round(rowCount))
  const firstEvenRow = -(normalizedRowCount - 1)
  const evenRows = Array.from(
    { length: normalizedRowCount },
    (_, index) => firstEvenRow + index * 2,
  )
  const oddRows = evenRows.map((row) => row + 1)
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
