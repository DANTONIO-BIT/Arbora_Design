import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  {
    label: 'Proyectos entregados',
    prefix: '+',
    target: 120,
    suffix: '',
    decimals: 0,
    desc: 'Apartamentos, casas, cocinas y mobiliario en Santiago.',
  },
  {
    label: 'Años de práctica',
    prefix: '',
    target: 8,
    suffix: '',
    decimals: 0,
    desc: 'Estudio independiente desde 2018, con equipo propio de obra.',
  },
  {
    label: 'Tiempo de respuesta',
    prefix: '',
    target: 24,
    suffix: 'h',
    decimals: 0,
    desc: 'Respondemos cada solicitud en menos de un día hábil.',
  },
  {
    label: 'Reseña promedio',
    prefix: '',
    target: 4.9,
    suffix: '/5',
    decimals: 1,
    desc: 'Basado en clientes de los últimos tres años.',
  },
]

const TrustSection = () => {
  const sectionRef = useRef(null)
  const counterRefs = useRef([])

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.from('.trust-item', {
      y: 30,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          if (prefersReduced) return

          STATS.forEach((stat, i) => {
            const el = counterRefs.current[i]
            if (!el) return

            const obj = { val: 0 }
            gsap.to(obj, {
              val: stat.target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent =
                  stat.decimals === 0
                    ? String(Math.round(obj.val))
                    : obj.val.toFixed(stat.decimals)
              },
            })
          })
        },
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-[#f6f4e3] py-32">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="trust-item">
              <span className="text-[11px] uppercase tracking-[0.28em] text-on-surface-variant block mb-4">
                {stat.label}
              </span>
              <span className="font-serif font-light text-[clamp(48px,6vw,84px)] leading-none tracking-[-0.02em] text-on-surface block">
                {stat.prefix}
                <em
                  className="italic text-primary not-italic"
                  style={{ fontStyle: 'italic' }}
                  ref={(el) => { counterRefs.current[i] = el }}
                >
                  0
                </em>
                {stat.suffix}
              </span>
              <p className="mt-3.5 text-[13px] leading-[1.6] text-on-surface-variant max-w-[200px] font-light">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
