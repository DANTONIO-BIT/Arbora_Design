import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSiteSettings } from '../../hooks/useSiteSettings'

gsap.registerPlugin(ScrollTrigger)

const Manifesto = () => {
  const sectionRef = useRef(null)
  const { settings } = useSiteSettings()

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from('.manifesto-img-inner', {
      scale: 1.06,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })

    gsap.from('.manifesto-quote', {
      y: 40,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="bg-inverse-surface-deep text-inverse-on-surface py-40"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-[5fr_4fr] gap-20 items-center">
          {/* Left: vertical photo */}
          <div className="aspect-[4/5] overflow-hidden">
            <img
              loading="lazy"
              src={settings.manifesto_image_url}
              alt="Detalle de materiales Arbora"
              width="800"
              height="1000"
              className="manifesto-img-inner w-full h-full object-cover"
              style={{ filter: 'brightness(0.85) contrast(1.05)' }}
            />
          </div>

          {/* Right: quote */}
          <div className="manifesto-quote">
            <span className="text-[11px] uppercase tracking-[0.28em] text-inverse-on-surface-muted block mb-8">
              [ 03 ] Manifiesto
            </span>
            <blockquote className="font-serif font-light text-[clamp(28px,3.4vw,46px)] leading-[1.25] tracking-[-0.005em] text-inverse-on-surface">
              "Una casa no se diseña,{' '}
              <em className="italic text-primary-container">se afina</em>. Como un instrumento —
              hasta que la luz, el silencio y la madera suenan en la misma nota."
            </blockquote>
            <div className="mt-12">
              <p className="text-[12px] uppercase tracking-[0.28em] text-inverse-on-surface-muted">
                Filosofía del estudio
              </p>
              <span className="block font-serif italic text-[18px] text-inverse-on-surface mt-1.5">
                Arbora · 2018
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Manifesto
