import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { testimonials } from '../../data/testimonials'

gsap.registerPlugin(ScrollTrigger)

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

const Stars = ({ rating }) => (
  <div className="flex gap-1" aria-label={`${rating} de 5 estrellas`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        className={`w-3.5 h-3.5 ${i < rating ? 'fill-primary' : 'fill-on-surface/15'}`}
      >
        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
      </svg>
    ))}
  </div>
)

const Testimonials = () => {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const gridRef = useRef(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from(headRef.current, {
      y: 30,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
    })

    gsap.from(gridRef.current.querySelectorAll('.testimonial-card'), {
      y: 40,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: gridRef.current, start: 'top 90%' },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-surface-variant py-32">
      <div className="container-custom">
        <div ref={headRef} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 mb-20">
          <span className="text-[11px] uppercase tracking-[0.28em] text-on-surface-variant block">
            [ 07 ] Testimonios
          </span>
          <h3 className="font-serif font-light text-[clamp(36px,5vw,72px)] tracking-[-0.01em] leading-[1] text-on-surface">
            Lo que dicen quienes ya <em className="italic">vivieron</em> el proceso.
          </h3>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <article
              key={t.author_name}
              className="testimonial-card bg-surface border border-on-surface/10 rounded-sm p-8 flex flex-col gap-6"
            >
              <Stars rating={t.rating} />
              <p className="font-serif text-[17px] leading-[1.6] text-on-surface flex-1">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-on-surface/10">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif italic text-sm shrink-0">
                  {initials(t.author_name)}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-on-surface">{t.author_name}</p>
                  <p className="text-[11px] text-on-surface-variant">{t.relative_time_description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
