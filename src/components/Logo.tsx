export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className={['brand', inverted && 'brand--inverted'].filter(Boolean).join(' ')}>
      <img src="/logo.webp" width="122" height="102" alt="" aria-hidden="true" />
      <span className="brand__text">
        <strong>IsoMat</strong>
        <small>ISOLIERTECHNIK</small>
      </span>
    </span>
  )
}
