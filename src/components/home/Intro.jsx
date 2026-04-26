import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Intro = () => {
  const sectionRef  = useRef(null)
  const headlineRef = useRef(null)
  const footRef     = useRef(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from(headlineRef.current, {
      y: 40,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: headlineRef.current, start: 'top 85%' },
    })

    gsap.from(footRef.current, {
      y: 30,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: footRef.current, start: 'top 90%' },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-surface py-36 md:py-40">
      <div className="container-custom">
        {/* Top grid: label / headline */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 md:gap-24 items-start">
          <span className="text-[11px] uppercase tracking-[0.28em] text-on-surface-variant pt-3 md:pt-4">
            [ 01 ] Estudio
          </span>
          <h2 ref={headlineRef} className="intro-headline font-serif font-light text-[clamp(32px,4.2vw,56px)] leading-[1.15] tracking-[-0.01em] text-on-surface">
            Una práctica de{' '}
            <em className="italic text-primary font-light">
              interiorismo y arquitectura interior
            </em>{' '}
            que entiende el hogar como una conversación lenta entre material, luz y memoria.
          </h2>
        </div>

        {/* Bottom grid: paragraph / signature — separated by subtle divider */}
        <div ref={footRef} className="intro-foot grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-16 md:gap-24 mt-20 pt-12 border-t border-on-surface/[0.08]">
          <p className="text-[15px] leading-[1.7] max-w-[520px] text-on-surface-variant font-light">
            Trabajamos con un número limitado de proyectos al año para garantizar atención artesanal
            en cada decisión — desde la planimetría hasta el último tirador. Nuestro recorrido abarca
            apartamentos en altura, casas suburbanas, cocinas y mobiliario de encargo.
          </p>
          <div className="flex items-end">
            <span className="font-serif italic text-[22px] text-primary">— Estudio Arbora</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Intro
