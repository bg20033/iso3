import { lazy, Suspense } from 'react'
import type { GalleryImage } from '../data/site'
import { ResponsiveImage } from './ResponsiveImage'
import { useInteractiveVisuals } from './useInteractiveVisuals'

const DomeGallery = lazy(() => import('./DomeGallery'))

export function ReferenceDome({ images }: { images: GalleryImage[] }) {
  const interactive = useInteractiveVisuals()

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
          <ResponsiveImage image={image} />
        </a>
      ))}
    </div>
  )

  if (!interactive) return staticGallery

  return (
    <div className="reactbits-dome-shell">
      <Suspense fallback={staticGallery}>
        <DomeGallery
          images={images.map((image) => ({
            src: image.thumb,
            alt: image.alt,
          }))}
          fit={0.56}
          minRadius={520}
          maxRadius={920}
          overlayBlurColor="#eceeef"
          dragSensitivity={18}
          dragDampening={0.8}
          openedImageWidth="min(860px, 84vw)"
          openedImageHeight="min(620px, 72vh)"
          imageBorderRadius="12px"
          openedImageBorderRadius="4px"
          grayscale={false}
        />
      </Suspense>
    </div>
  )
}
