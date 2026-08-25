export function Logo({ inverted = false, iconOnly = false }: { inverted?: boolean; iconOnly?: boolean }) {
  return (
    <span className={['brand', inverted && 'brand--inverted'].filter(Boolean).join(' ')}>
      <img src="/logo.webp" width="122" height="102" alt="" aria-hidden="true" />
      {!iconOnly && (
        <span className="brand__text">
          <strong>IsoMat</strong>
          <small>ISOLIERTECHNIK</small>
        </span>
      )}
    </span>
  )
}
