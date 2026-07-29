import type { CSSProperties, ElementType } from 'react'
import { useInView } from '../hooks/useInView'
import './ScrollReveal.css'

type ScrollRevealProps = {
  children: string
  as?: ElementType
  containerClassName?: string
  textClassName?: string
  disabled?: boolean
}

const ScrollReveal = ({
  children,
  as: Tag = 'h2',
  containerClassName = '',
  textClassName = '',
  disabled = false,
}: ScrollRevealProps) => {
  const { ref, inView } = useInView<HTMLElement>()
  const visible = disabled || inView

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal${visible ? ' is-visible' : ''}${containerClassName ? ` ${containerClassName}` : ''}`}
    >
      <span className={`scroll-reveal-text ${textClassName}`}>
        {children.split(/(\s+)/).map((word, index) =>
          word.match(/^\s+$/) ? (
            word
          ) : (
            <span
              className="word"
              style={{ '--word-index': index } as CSSProperties}
              key={`${word}-${index}`}
            >
              {word}
            </span>
          ),
        )}
      </span>
    </Tag>
  )
}

export default ScrollReveal
