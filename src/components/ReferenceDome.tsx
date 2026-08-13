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
import { useLanguage } from '../i18n'

const DomeGallery = lazy(() => import('./DomeGallery'))

export function ReferenceDome({ images }: { images: GalleryImage[] }) {
  const { language, pick } = useLanguage()
  const imageAlt = (image: GalleryImage, index: number) =>
    language === 'de' ? image.alt : `Installed IsoMat insulation – reference ${String(index + 1).padStart(2, '0')}`
  // Der Globus läuft jetzt auch auf dem Telefon – dort ist er der Inhalt,
  // nicht nur Zierde.
  const interactive = useSceneVisuals()
  const shellRef = useRef<HTMLDivElement>(null)
  const nearby = useNearViewport(shellRef)
  const galleryEnabled = interactive && nearby
  const [ready, setReady] = useState(false)
  const domeImages = useMemo(
    () =>
      images.map((image, index) => ({
        src: image.thumb,
        alt: language === 'de'
          ? image.alt
          : `Installed IsoMat insulation – reference ${String(index + 1).padStart(2, '0')}`,
      })),
    [images, language],
  )
  const markReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (!galleryEnabled) setReady(false)
  }, [galleryEnabled])

  const staticGallery = (
    <div className="reference-static-grid">
      {images.slice(0, 12).map((image, index) => (
        <a
          href={image.src}
          target="_blank"
          rel="noreferrer"
          aria-label={`${imageAlt(image, index)} ${pick('vergrössern', 'enlarge')}`}
          key={image.src}
        >
          <img
            src={image.thumb}
            width={image.width}
            height={image.height}
            alt={imageAlt(image, index)}
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
