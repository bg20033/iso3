import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import './ScrollStack.css'

export type ScrollStackItemProps = {
  itemClassName?: string
  children: ReactNode
  style?: CSSProperties
}

export const ScrollStackItem = ({
  children,
  itemClassName = '',
  style,
}: ScrollStackItemProps) => (
  <article className={`scroll-stack-card ${itemClassName}`} style={style}>
    {children}
  </article>
)

type ScrollStackProps = {
  className?: string
  children: ReactNode
  disabled?: boolean
}

const ScrollStack = ({
  children,
  className = '',
  disabled = false,
}: ScrollStackProps) => {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled) return
    const root = rootRef.current
    if (!root) return
    let frame = 0

    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      root.querySelectorAll<HTMLElement>('.scroll-stack-card').forEach((card) => {
        const rect = card.getBoundingClientRect()
        const progress = Math.max(
          0,
          Math.min(1, (viewport * 0.82 - rect.top) / (viewport * 0.68)),
        )
        card.style.setProperty('--stack-progress', progress.toFixed(3))
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [disabled])

  return (
    <div
      ref={rootRef}
      className={`scroll-stack${disabled ? ' is-static' : ''}${className ? ` ${className}` : ''}`}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child
        const element = child as ReactElement<ScrollStackItemProps>
        return cloneElement(element, {
          style: {
            ...(element.props.style ?? {}),
            '--stack-index': index,
          } as CSSProperties,
        })
      })}
    </div>
  )
}

export default ScrollStack
