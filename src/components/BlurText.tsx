import { motion, useReducedMotion } from 'motion/react'

type BlurTextProps = {
  text: string
  className?: string
  as?: 'h1' | 'h2'
}

export function BlurText({ text, className, as = 'h2' }: BlurTextProps) {
  const reduceMotion = useReducedMotion()
  const Tag = motion[as]
  const words = text.split(' ')

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="blur-word"
          initial={
            reduceMotion ? false : { opacity: 0, filter: 'blur(12px)', y: 18 }
          }
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.55,
            delay: reduceMotion ? 0 : index * 0.055,
            ease: [0.22, 1, 0.36, 1],
          }}
          key={`${word}-${index}`}
        >
          {word}{' '}
        </motion.span>
      ))}
    </Tag>
  )
}
