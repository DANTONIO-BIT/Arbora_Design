import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CTAFinal = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from('.cta-headline', {
      y: 60,
      duration: 1.3,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })

    gsap.from('.cta-buttons', {
      y: 30,
      duration: 1,
      ease: 'power3.out',
      delay: 0.25,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
  }, { scope: sectionRef })

  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '56900000000'

  return (
    <section ref={sectionRef} className="bg-surface py-48 md:py-52 text-center">
      <div className="container-custom">
        <span className="text-[11px] uppercase tracking-[0.28em] text-on-surface-variant block mb-12">
          [ 07 ] Comienza tu proyecto
        </span>

        <h2 className="cta-headline font-serif font-light text-[clamp(48px,8vw,132px)] leading-[0.95] tracking-[-0.025em] text-on-surface">
          Cuéntanos<br />
          sobre tu{' '}
          <em className="italic font-light text-primary">casa</em>.
        </h2>

        <div className="cta-buttons mt-16 flex justify-center gap-4 flex-wrap">
          <Link
            to="/contacto"
            className="inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.28em] bg-on-surface text-surface px-9 py-[18px] rounded-full transition-colors duration-300 hover:bg-primary"
          >
            Agendar visita →
          </Link>
          <a
            href={`https://wa.me/${wa}?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.28em] border border-on-surface/30 text-on-surface px-9 py-[18px] rounded-full transition-colors duration-300 hover:bg-on-surface hover:text-surface hover:border-on-surface"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default CTAFinal
