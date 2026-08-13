import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import type { GalleryImage } from '../data/site'
import { useLanguage } from '../i18n'

type ImageLightboxProps = {
  images: GalleryImage[]
  /** Index des aktiven Bildes – null schliesst die Ansicht. */
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
  /** Über einem bereits offenen Dialog wird eine höhere Ebene gebraucht. */
  layer?: 'base' | 'over-modal'
}

const ZOOM = 2.4

/**
 * Vergrösserte Ansicht einer Aufnahme. Sie legt sich als eigene Ebene über die
 * Seite – auch über ein bereits offenes Modal – statt einen neuen Tab zu
 * öffnen. Klick auf das Bild zoomt, im gezoomten Zustand lässt es sich ziehen.
 */
export function ImageLightbox({
  images,
  index,
  onClose,
  onNavigate,
  layer = 'base',
}: ImageLightboxProps) {
  const { pick } = useLanguage()
  const [zoomed, setZoomed] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const closeRef = useRef<HTMLButtonElement>(null)
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
    moved: boolean
  } | null>(null)

  const open = index !== null && index >= 0 && index < images.length
  const image = open ? images[index] : undefined

  const reset = useCallback(() => {
    setZoomed(false)
    setOffset({ x: 0, y: 0 })
  }, [])

  const goTo = useCallback(
    (next: number) => {
      if (images.length === 0) return
      reset()
      onNavigate((next + images.length) % images.length)
    },
    [images.length, onNavigate, reset],
  )

  useEffect(() => {
    if (!open) return
    reset()
  }, [index, open, reset])

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          event.stopPropagation()
          onClose()
          break
        case 'ArrowLeft':
          event.preventDefault()
          goTo((index ?? 0) - 1)
          break
        case 'ArrowRight':
          event.preventDefault()
          goTo((index ?? 0) + 1)
          break
        default:
          break
      }
    }

    /* Capture, damit ein darunterliegender Dialog die Taste nicht mitbekommt. */
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [goTo, index, onClose, open])

  const handlePointerDown = (event: ReactPointerEvent<HTMLImageElement>) => {
    if (!zoomed) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
      moved: false,
    }
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true
    setOffset({ x: drag.originX + dx, y: drag.originY + dy })
  }

  const endDrag = (event: ReactPointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (!drag.moved) toggleZoom()
  }

  const toggleZoom = () => {
    setZoomed((value) => {
      if (value) setOffset({ x: 0, y: 0 })
      return !value
    })
  }

  if (!open || !image || typeof document === 'undefined') return null

  const multiple = images.length > 1
  const style = {
    '--lightbox-scale': zoomed ? ZOOM : 1,
    '--lightbox-x': `${zoomed ? offset.x : 0}px`,
    '--lightbox-y': `${zoomed ? offset.y : 0}px`,
  } as CSSProperties

  return createPortal(
    <div
      className={`lightbox${layer === 'over-modal' ? ' lightbox--over-modal' : ''}${
        zoomed ? ' is-zoomed' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`${image.alt} – ${pick('vergrösserte Ansicht', 'enlarged view')}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="lightbox__bar">
        <span className="lightbox__count">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
        <div className="lightbox__tools">
          <button
            type="button"
            onClick={toggleZoom}
            aria-pressed={zoomed}
            aria-label={zoomed ? pick('Zoom zurücksetzen', 'Reset zoom') : pick('Bild vergrössern', 'Enlarge image')}
          >
            {zoomed ? <ZoomOut aria-hidden="true" /> : <ZoomIn aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            ref={closeRef}
            aria-label={pick('Ansicht schliessen', 'Close view')}
          >
            <X aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="lightbox__stage"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        {multiple && (
          <button
            className="lightbox__nav lightbox__nav--prev"
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label={pick('Vorherige Aufnahme', 'Previous image')}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        )}

        <img
          className="lightbox__image"
          src={image.src}
          srcSet={`${image.thumb} 480w, ${image.src} 1280w`}
          sizes="(max-width: 900px) 100vw, 90vw"
          width={image.width}
          height={image.height}
          alt={image.alt}
          style={style}
          decoding="async"
          draggable={false}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />

        {multiple && (
          <button
            className="lightbox__nav lightbox__nav--next"
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label={pick('Nächste Aufnahme', 'Next image')}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </div>

      <p className="lightbox__caption">{image.alt}</p>
    </div>,
    document.body,
  )
}
