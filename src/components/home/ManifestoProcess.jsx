import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSiteSettings } from '../../hooks/useSiteSettings'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { num: '01', title: 'Encuentro' },
  { num: '02', title: 'Concepto' },
  { num: '03', title: 'Diseño técnico' },
  { num: '04', title: 'Obra' },
]

// Manifesto + Process merged into one condensed section — a small photo and
// a one-line manifesto instead of a full storytelling block, and process
// steps as short labels instead of paragraphs. Keeps the page shorter and
// the focus on getting to the lead-capture CTA, not explaining everything.
const ManifestoProcess = () => {
  const sectionRef = useRef(null)
  const { settings } = useSiteSettings()

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from('.mp-manifesto', {
      y: 30,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
    })

    gsap.from('.mp-step', {
      y: 24,
      opacity: 0,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="bg-inverse-surface-deep text-inverse-on-surface py-24 md:py-28"
    >
      <div className="container-custom grid grid-cols-1 md:grid-cols-[260px_1fr] gap-14 md:gap-20 items-center">

        {/* Manifesto — small photo + one line */}
        <div className="mp-manifesto space-y-6">
          <div className="aspect-[4/5] max-w-[260px] overflow-hidden">
            <img
              loading="lazy"
              src={settings.manifesto_image_url}
              alt="Detalle de materiales Arbora"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.85) contrast(1.05)' }}
            />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.28em] text-inverse-on-surface-muted block mb-3">
              [ 03 ] Manifiesto
            </span>
            <p className="font-serif font-light text-[20px] leading-[1.35] text-inverse-on-surface">
              Una casa no se diseña,{' '}
              <em className="italic text-primary-container">se afina</em>.
            </p>
          </div>
        </div>

        {/* Process — condensed to short labels, no long descriptions */}
        <div>
          <span className="text-[11px] uppercase tracking-[0.28em] text-inverse-on-surface-muted block mb-6">
            [ 04 ] Proceso
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-inverse-on-surface/20 pt-7">
            {STEPS.map((step) => (
              <div key={step.num} className="mp-step">
                <span className="font-serif italic text-sm text-inverse-on-surface-muted block mb-2">
                  {step.num}
                </span>
                <h4 className="font-serif font-light text-[19px] leading-tight text-inverse-on-surface">
                  {step.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ManifestoProcess
