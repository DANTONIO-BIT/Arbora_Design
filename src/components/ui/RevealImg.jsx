import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../../lib/utils'

gsap.registerPlugin(ScrollTrigger)

/**
 * Drop-in replacement for <img> with a clip-path reveal + subtle scale on scroll entry.
 * The wrapper div inherits the parent's sizing — add aspect ratio / sizing on wrapperClassName.
 */
const RevealImg = ({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  wrapperClassName = '',
  start = 'top 88%',
}) => {
  const wrapperRef = useRef(null)
  const imgRef = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return

    gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start,
      },
    })
      .from(wrapperRef.current, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.4,
        ease: 'power4.out',
      }, 0)
      .from(imgRef.current, {
        scale: 1.12,
        duration: 1.8,
        ease: 'power3.out',
      }, 0)
  }, { scope: wrapperRef })

  return (
    <div ref={wrapperRef} className={`overflow-hidden ${wrapperClassName}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
      />
    </div>
  )
}

export default RevealImg
