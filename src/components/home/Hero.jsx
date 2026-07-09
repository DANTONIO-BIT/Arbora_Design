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

    gsap.from('.hero-wordmark', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.65,
    })

    gsap.from('.hero-tagline', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.95,
    })

    gsap.from('.hero-photo-caption', {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 1.1,
    })
  }, { scope: containerRef })

  const focalX = settings.hero_focal_x ?? '50'
  const focalY = settings.hero_focal_y ?? '50'

  return (
    <header ref={containerRef} className="relative overflow-hidden">
      {/* Photo block — framed, ~3/4 of viewport height */}
      <div
        data-nav-theme="dark"
        className="relative mt-4 md:mt-6 mx-4 md:mx-8 h-[75vh] min-h-[460px] overflow-hidden"
      >
        {/* Entrance curtain */}
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
              'linear-gradient(180deg, rgba(20,19,13,0.35) 0%, rgba(20,19,13,0.02) 32%, rgba(20,19,13,0.55) 100%)',
          }}
        />

        {/* Rotated side label — visible on large screens */}
        <div
          className="hero-photo-caption absolute hidden lg:block z-10"
          style={{
            left: '32px',
            top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            transformOrigin: 'left center',
          }}
        >
          <span className="text-[11px] uppercase tracking-[0.28em]" style={{ color: 'rgba(243, 241, 224, 0.65)' }}>
            Est. 2018 · Santiago de Chile
          </span>
        </div>

        {/* Caption bar — featured project + scroll indicator */}
        <div
          className="hero-photo-caption absolute bottom-6 left-0 right-0 z-10 px-6 md:px-10 flex justify-between items-end text-[11px] uppercase tracking-[0.28em]"
          style={{ color: 'rgba(243, 241, 224, 0.75)' }}
        >
          <span>Featured · Residencia Terra · Las Condes</span>
          <div className="flex items-center gap-3">
            <span>Scroll</span>
            <span className="inline-block w-10 h-px bg-current opacity-50" />
          </div>
        </div>
      </div>

      {/* Wordmark + tagline block — below the photo, normal light surface */}
      <div className="bg-surface pt-14 pb-20 md:pt-16 md:pb-24">
        <div className="container-custom">
          <h1 className="hero-wordmark overflow-hidden">
            <span className="block font-display uppercase text-on-surface leading-[0.85] tracking-[0.01em] text-[clamp(64px,13vw,180px)]">
              Arbora
            </span>
          </h1>

          <div className="hero-tagline mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            <p className="font-serif font-light text-[clamp(20px,2.2vw,28px)] leading-[1.3] tracking-[-0.005em] text-on-surface">
              espacios que <em className="italic text-primary">respiran</em> en silencio.
            </p>
            <div>
              <span className="text-[11px] uppercase tracking-[0.28em] text-on-surface-variant block mb-3">
                Estudio de interiorismo
              </span>
              <p className="text-[14px] leading-[1.65] max-w-[380px] font-light text-on-surface-variant">
                Diseñamos casas, cocinas y muebles a medida en Santiago. Cada proyecto comienza con
                la luz, el clima y los hábitos de quienes lo van a habitar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
