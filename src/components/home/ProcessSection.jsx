import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    num: '01',
    title: 'Encuentro',
    desc: 'Visita inicial al espacio, conversación sobre hábitos, presupuesto y horizontes. Sin compromiso.',
  },
  {
    num: '02',
    title: 'Concepto',
    desc: 'Anteproyecto con planimetría, paleta de materiales, moodboard y visualización 3D.',
  },
  {
    num: '03',
    title: 'Diseño técnico',
    desc: 'Detallado constructivo, especificación de mobiliario a medida y cubicación cerrada.',
  },
  {
    num: '04',
    title: 'Obra',
    desc: 'Dirección de obra con supervisión semanal hasta la entrega y styling final del espacio.',
  },
]

const ProcessSection = () => {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const gridRef    = useRef(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from(headRef.current, {
      y: 30,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
    })

    if (gridRef.current) {
      gsap.from(gridRef.current.querySelectorAll('.proc-step'), {
        y: 30,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 90%' },
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="bg-inverse-surface text-inverse-on-surface py-40"
    >
      <div className="container-custom">
        {/* Header */}
        <div ref={headRef} className="proc-head grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-20 mb-24 items-start">
          <span className="text-[11px] uppercase tracking-[0.28em] text-inverse-on-surface-muted pt-3">
            [ 05 ] Proceso
          </span>
          <h3 className="font-serif font-light text-[clamp(36px,5vw,72px)] tracking-[-0.01em] leading-[1] text-inverse-on-surface">
            Cuatro etapas,{' '}
            <em className="italic font-light text-primary-container">una conversación</em>.
          </h3>
        </div>

        {/* 4-column grid */}
        <div ref={gridRef} className="proc-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {STEPS.map((step) => (
            <div key={step.num} className="proc-step border-t border-inverse-on-surface/20 pt-7">
              <span className="font-serif italic text-sm text-inverse-on-surface-muted block mb-6">
                {step.num}
              </span>
              <h4 className="font-serif font-light text-[28px] tracking-[-0.005em] text-inverse-on-surface mb-4 leading-tight">
                {step.title}
              </h4>
              <p className="text-[14px] leading-[1.65] text-inverse-on-surface/70 font-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
