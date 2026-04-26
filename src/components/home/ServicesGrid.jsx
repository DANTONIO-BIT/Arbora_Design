import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '../../data/services'

gsap.registerPlugin(ScrollTrigger)

// Italic accent split: [normal part, italic accent]
const NAME_PARTS = {
  'interiorismo':             ['Interiorismo', 'residencial'],
  'diseno-cocinas':           ['Diseño de', 'cocinas'],
  'reformas-hogar':           ['Reformas de', 'hogar'],
  'proyectos-personalizados': ['Proyectos', 'personalizados'],
  'consultoria-estilo':       ['Consultoría de', 'estilo'],
  'modelados-espacios':       ['Modelado', '3D'],
}

const ServicesGrid = () => {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const listRef    = useRef(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from(headRef.current, {
      y: 30,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
    })

    if (listRef.current) {
      gsap.from(listRef.current.querySelectorAll('.svc-row'), {
        y: 20,
        stagger: 0.07,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: listRef.current, start: 'top 90%' },
      })
    }
  }, { scope: sectionRef })

  const total = services.length

  return (
    <section ref={sectionRef} className="bg-surface py-40">
      <div className="container-custom">
        {/* Header */}
        <div ref={headRef} className="svc-head grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-20 mb-20 items-start">
          <span className="text-[11px] uppercase tracking-[0.28em] text-on-surface-variant pt-3">
            [ 04 ] Servicios
          </span>
          <h3 className="font-serif font-light text-[clamp(36px,5vw,72px)] tracking-[-0.01em] leading-[1] text-on-surface">
            Lo que{' '}
            <em className="italic font-light text-primary">hacemos</em>, con cuidado.
          </h3>
        </div>

        {/* Numbered list */}
        <div ref={listRef} className="svc-list border-t border-on-surface/[0.12]">
          {services.map((service, i) => {
            const parts = NAME_PARTS[service.slug] ?? [service.title, '']
            const num = String(i + 1).padStart(2, '0')
            const tot = String(total).padStart(2, '0')

            return (
              <div
                key={service.id}
                className="svc-row group grid items-center gap-12 py-9 border-b border-on-surface/[0.12] cursor-pointer transition-all duration-300 hover:bg-[#f6f4e3] hover:px-4"
                style={{ gridTemplateColumns: '80px 2fr 3fr auto' }}
              >
                <span className="font-serif italic text-[18px] text-on-surface-variant">
                  {num} / {tot}
                </span>
                <span className="font-serif font-light text-[clamp(22px,2.2vw,32px)] tracking-[-0.005em] text-on-surface leading-tight">
                  {parts[0]}{' '}
                  {parts[1] && (
                    <em className="italic text-primary">{parts[1]}</em>
                  )}
                </span>
                <span className="text-[14px] leading-[1.6] text-on-surface-variant max-w-[420px] hidden md:block font-light">
                  {service.description}
                </span>
                <span className="font-serif text-[24px] text-on-surface opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                  →
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesGrid
