import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import { useSiteSettings } from '../../hooks/useSiteSettings'

const Hero = () => {
  const containerRef = useRef(null)
  const curtainRef   = useRef(null)

  const { settings } = useSiteSettings()

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Curtain wipe — always runs (not motion-sensitive, it's instant on reduce)
    gsap.fromTo(curtainRef.current,
      { scaleY: 1 },
      { scaleY: 0, duration: prefersReduced ? 0 : 1.6, ease: 'expo.inOut', transformOrigin: 'top' }
    )

    if (prefersReduced) return

    gsap.from('.hero-title-line', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'expo.out',
      delay: 0.65,
    })

    gsap.from('.hero-side-content', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.95,
    })

    gsap.from('.hero-bottom-bar', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 1.1,
    })
  }, { scope: containerRef })

  const focalX = settings.hero_focal_x ?? '50'
  const focalY = settings.hero_focal_y ?? '50'

  return (
    <header
      ref={containerRef}
      data-nav-theme="dark"
      className="relative h-screen min-h-[720px] overflow-hidden flex items-end"
    >
      {/* Entrance curtain — sits above content, below navbar (z-50) */}
      <div
        ref={curtainRef}
        className="absolute inset-0 z-40 origin-top"
        style={{ backgroundColor: 'var(--color-inverse-surface-deep)' }}
      />

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url(${settings.hero_image_url})`,
          backgroundPosition: `${focalX}% ${focalY}%`,
          transform: 'scale(1.04)',
        }}
      />

      {/* Gradient overlay — dark top + dark bottom, transparent center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,19,13,0.45) 0%, rgba(20,19,13,0.05) 35%, rgba(20,19,13,0.65) 100%)',
        }}
      />

      {/* Rotated side label — visible on large screens */}
      <div
        className="absolute hidden lg:block z-10"
        style={{
          left: '48px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'left center',
        }}
      >
        <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: 'rgba(243, 241, 224, 0.65)' }}>
          Est. 2018 · Santiago de Chile
        </span>
      </div>

      {/* Main content — anchored to bottom */}
      <div className="relative z-10 w-full container-custom pb-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
        {/* Title — word-by-word reveal */}
        <h1>
          <span className="hero-title-line block overflow-hidden">
            <span className="block font-serif font-light text-[clamp(56px,9vw,132px)] leading-[0.92] tracking-[-0.02em] text-inverse-on-surface">
              espacios
            </span>
          </span>
          <span className="hero-title-line block overflow-hidden">
            <span className="block font-serif font-light text-[clamp(56px,9vw,132px)] leading-[0.92] tracking-[-0.02em] text-inverse-on-surface">
              que{' '}
              <em
                className="italic font-light"
                style={{ color: 'rgba(243, 241, 224, 0.75)' }}
              >
                respiran
              </em>
            </span>
          </span>
          <span className="hero-title-line block overflow-hidden">
            <span className="block font-serif font-light text-[clamp(56px,9vw,132px)] leading-[0.92] tracking-[-0.02em] text-inverse-on-surface">
              en silencio.
            </span>
          </span>
        </h1>

        {/* Side copy */}
        <div className="hero-side-content pb-5">
          <span
            className="text-[11px] uppercase tracking-[0.28em] block mb-4"
            style={{ color: 'rgba(243, 241, 224, 0.55)' }}
          >
            Estudio de interiorismo
          </span>
          <p
            className="text-[15px] leading-[1.65] max-w-[380px] font-light"
            style={{ color: 'rgba(243, 241, 224, 0.85)' }}
          >
            Diseñamos casas, cocinas y muebles a medida en Santiago. Cada proyecto comienza con
            la luz, el clima y los hábitos de quienes lo van a habitar.
          </p>
        </div>
      </div>

      {/* Bottom bar — featured project + scroll indicator */}
      <div
        className="hero-bottom-bar absolute bottom-8 left-0 right-0 z-10 container-custom flex justify-between items-end text-[11px] uppercase tracking-[0.28em]"
        style={{ color: 'rgba(243, 241, 224, 0.70)' }}
      >
        <span>Featured · Residencia Terra · Las Condes</span>
        <div className="flex items-center gap-3">
          <span>Scroll</span>
          <span className="inline-block w-10 h-px bg-current opacity-50" />
        </div>
      </div>
    </header>
  )
}

export default Hero
