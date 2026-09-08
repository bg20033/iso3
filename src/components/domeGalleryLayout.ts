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
  const allRows = [evenRows, oddRows]
  const capacity = xColumns.length * normalizedRowCount

  if (pool.length === 0) {
    return []
  }
  if (pool.length > capacity) {
    console.warn(
      `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${capacity}). Some images will not be shown.`,
    )
  }

  const images = pool.slice(0, capacity).map((image) =>
    typeof image === 'string'
      ? { src: image, alt: '' }
      : { src: image.src || '', alt: image.alt || '' },
  )
  const baseRowsPerColumn = Math.floor(images.length / xColumns.length)
  const columnsWithExtraRow = images.length % xColumns.length
  const coordinates = xColumns.flatMap((x, column) => {
    const extrasBefore = Math.floor(
      (column * columnsWithExtraRow) / xColumns.length,
    )
    const extrasAfter = Math.floor(
      ((column + 1) * columnsWithExtraRow) / xColumns.length,
    )
    const rowsInColumn = baseRowsPerColumn + Number(extrasAfter > extrasBefore)
    const availableRows = allRows[column % 2]
    const unusedRows = normalizedRowCount - rowsInColumn
    const rowOffset =
      Math.floor(unusedRows / 2) +
      Number(unusedRows % 2 === 1 && column % 4 >= 2)
    const rows = availableRows.slice(rowOffset, rowOffset + rowsInColumn)

    return rows.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }))
  })

  // Jede Spalte kompakt füllen: keine Duplikate und keine Löcher im Inneren.
  return images.map((image, index) => ({
    ...coordinates[index],
    ...image,
  }))
}
