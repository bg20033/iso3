import { useEffect, useState } from 'react'
import { useDrag } from '@use-gesture/react'
import { X } from 'lucide-react'
import type { GalleryImage } from '../data/site'
import { ResponsiveImage } from './ResponsiveImage'

export function DomeGallery({ images }: { images: GalleryImage[] }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [opened, setOpened] = useState<GalleryImage>()
  const bind = useDrag(
    ({ offset: [x, y] }) => {
      setOffset({ x, y })
    },
    { from: () => [offset.x, offset.y] },
  )

  useEffect(() => {
    if (!opened) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpened(undefined)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [opened])

  return (
    <>
      <div className="dome-shell">
        <div
          {...bind()}
          className="dome-gallery"
          style={{
            transform: `rotateX(${Math.max(-5, Math.min(5, offset.y / 80))}deg) rotateY(${Math.max(-5, Math.min(5, offset.x / 80))}deg)`,
          }}
        >
          {images.slice(0, 18).map((image, index) => (
            <button
              type="button"
              className={`dome-gallery__item dome-gallery__item--${(index % 5) + 1}`}
              onClick={() => setOpened(image)}
              aria-label={`${image.alt} vergrössern`}
              key={image.src}
            >
              <ResponsiveImage image={image} />
            </button>
          ))}
        </div>
        <p className="dome-hint">Ziehen oder Bild auswählen</p>
      </div>

      {opened && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Vergrösserte Referenzaufnahme"
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={() => setOpened(undefined)}
            aria-label="Bildansicht schliessen"
          >
            <X aria-hidden="true" />
          </button>
          <ResponsiveImage image={opened} />
          <p>{opened.alt}</p>
        </div>
      )}
    </>
  )
}
