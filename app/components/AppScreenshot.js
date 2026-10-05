const WIDTHS = [320, 480, 640, 960]

export function screenshotId(index) {
  return String(index).padStart(2, '0')
}

export function screenshotSrc(index, width = 640, format = 'webp') {
  return `/marketing/screens/surpass-${screenshotId(index)}-${width}.${format}`
}

export function screenshotSources(index) {
  const id = screenshotId(index)
  return {
    avif: WIDTHS.map((width) => `/marketing/screens/surpass-${id}-${width}.avif ${width}w`).join(', '),
    webp: WIDTHS.map((width) => `/marketing/screens/surpass-${id}-${width}.webp ${width}w`).join(', '),
    fallback: `/marketing/screens/surpass-${id}-640.webp`,
    preload: `/marketing/screens/surpass-${id}-480.webp`,
  }
}

export default function AppScreenshot({
  index,
  alt,
  sizes = '(max-width: 760px) 72vw, 320px',
  priority = false,
  className = '',
}) {
  const sources = screenshotSources(index)
  return (
    <picture>
      <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
      <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
      <img
        className={className}
        src={sources.fallback}
        width={1287}
        height={2796}
        alt={alt}
        decoding={priority ? 'sync' : 'async'}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
      />
    </picture>
  )
}
