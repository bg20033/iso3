import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { GalleryImage } from '../data/site'
import { useNearViewport } from '../hooks/useNearViewport'
import { useSceneVisuals } from './useInteractiveVisuals'

const DomeGallery = lazy(() => import('./DomeGallery'))

export function ReferenceDome({ images }: { images: GalleryImage[] }) {
  // Der Globus läuft jetzt auch auf dem Telefon – dort ist er der Inhalt,
  // nicht nur Zierde.
  const interactive = useSceneVisuals()
  const shellRef = useRef<HTMLDivElement>(null)
  const nearby = useNearViewport(shellRef)
  const galleryEnabled = interactive && nearby
  const [ready, setReady] = useState(false)
  const domeImages = useMemo(
    () =>
      images.map((image) => ({
        src: image.thumb,
        alt: image.alt,
      })),
    [images],
  )
  const markReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (!galleryEnabled) setReady(false)
  }, [galleryEnabled])

  const staticGallery = (
    <div className="reference-static-grid">
      {images.slice(0, 12).map((image) => (
        <a
          href={image.src}
          target="_blank"
          rel="noreferrer"
          aria-label={`${image.alt} vergrössern`}
          key={image.src}
        >
          <img
            src={image.thumb}
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
            decoding="async"
          />
        </a>
      ))}
    </div>
  )

  return (
    <div className="reactbits-dome-shell" ref={shellRef}>
      <div className={`gallery-swap${ready ? ' is-ready' : ''}`}>
        <div
          className="gallery-swap__fallback"
          aria-hidden={ready}
          inert={ready}
        >
          {staticGallery}
        </div>
        {galleryEnabled && (
          <div
            className="gallery-swap__interactive"
            aria-hidden={!ready}
            inert={!ready}
          >
            <Suspense fallback={null}>
              <DomeGallery
                images={domeImages}
                fit={0.56}
                minRadius={520}
                maxRadius={920}
                overlayBlurColor="#eceeef"
                dragSensitivity={18}
                dragDampening={0.8}
                openedImageWidth="min(860px, 92vw)"
                openedImageHeight="min(620px, 66vh)"
                imageBorderRadius="12px"
                openedImageBorderRadius="4px"
                grayscale={false}
                onReady={markReady}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}
