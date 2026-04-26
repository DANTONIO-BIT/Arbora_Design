import { useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

// Wipe transition between routes. First render is skipped.
const PageCurtain = () => {
  const ref = useRef(null)
  const location = useLocation()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    gsap.timeline()
      .fromTo(ref.current,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 0.35, ease: 'power4.inOut' }
      )
      .to(ref.current,
        { scaleY: 0, transformOrigin: 'bottom center', duration: 0.4, ease: 'power4.inOut', delay: 0.05 }
      )
  }, [location.pathname])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{ backgroundColor: '#1c1c12', transform: 'scaleY(0)' }}
    />
  )
}

export default PageCurtain
