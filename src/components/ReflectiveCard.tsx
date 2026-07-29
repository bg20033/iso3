import {
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'
import './ReflectiveCard.css'

type ReflectiveCardProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  disabled?: boolean
}

const ReflectiveCard = ({
  children,
  className = '',
  style,
  disabled = false,
}: ReflectiveCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.pointerType === 'touch') return
    const card = cardRef.current
    if (!card) return
    const bounds = card.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    card.style.setProperty('--reflect-x', `${x}%`)
    card.style.setProperty('--reflect-y', `${y}%`)
    card.style.setProperty('--reflect-opacity', '1')
  }

  return (
    <div
      ref={cardRef}
      className={`reflective-card${disabled ? ' is-static' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        cardRef.current?.style.setProperty('--reflect-opacity', '0')
      }}
    >
      <span className="reflective-card__sheen" aria-hidden="true" />
      <span className="reflective-card__edge" aria-hidden="true" />
      <div className="reflective-card__content">{children}</div>
    </div>
  )
}

export default ReflectiveCard
