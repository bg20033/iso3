import {
  responsiveImageSizes,
  responsiveImageSrcSet,
  type GalleryImage,
} from '../data/site'

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
      srcSet={responsiveImageSrcSet(image)}
      sizes={responsiveImageSizes}
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
