import type { GalleryImage } from '../data/site'

type ResponsiveImageProps = {
  image: GalleryImage
  className?: string
  eager?: boolean
}

export function ResponsiveImage({
  image,
  className,
  eager = false,
}: ResponsiveImageProps) {
  return (
    <img
      src={image.src}
      srcSet={`${image.thumb} 480w, ${image.src} 1280w`}
      sizes="(max-width: 720px) 92vw, (max-width: 1200px) 48vw, 720px"
      width={image.width}
      height={image.height}
      alt={image.alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
    />
  )
}
