import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const LETTERS = 'ARBORA'.split('')

const Preloader = ({ onComplete }) => {
  const rootRef = useRef(null)
  const topCurtainRef = useRef(null)
  const botCurtainRef = useRef(null)
  const lineRef = useRef(null)
  const counterRef = useRef(null)

  useGSAP(() => {
    // ── Initial state ────────────────────────────────────
    gsap.set('.pl-letter span', { yPercent: 110 })
    gsap.set('.pl-sub', { opacity: 0, y: 8 })
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set([topCurtainRef.current, botCurtainRef.current], { yPercent: 0 })

    let count = { val: 0 }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        onComplete?.()
      },
    })

    tl
      // Line grows
      .to(lineRef.current, { scaleX: 1, duration: 1.1, ease: 'expo.inOut' })

      // Counter counts up
      .to(count, {
        val: 100,
        duration: 1.4,
        ease: 'none',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(Math.round(count.val)).padStart(2, '0')
          }
        },
      }, '<')

      // Letters reveal
      .to('.pl-letter span', {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power4.out',
      }, '-=0.8')

      // Subtitle
      .to('.pl-sub', { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')

      // Hold
      .to({}, { duration: 0.55 })

      // ── EXIT: curtain split ──────────────────────────────
      .to(topCurtainRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'expo.inOut',
      })
      .to(botCurtainRef.current, {
        yPercent: 100,
        duration: 0.8,
        ease: 'expo.inOut',
      }, '<')

      // Fade the whole shell last so nothing flashes
      .to(rootRef.current, { autoAlpha: 0, duration: 0.01 })

  }, { scope: rootRef })

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      {/* Top curtain */}
      <div
        ref={topCurtainRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-surface"
      />

      {/* Bottom curtain */}
      <div
        ref={botCurtainRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-surface"
      />

      {/* Content — sits between curtains, centred */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">

        {/* Brand letters */}
        <div className="flex items-end gap-[0.04em]">
          {LETTERS.map((letter, i) => (
            <div key={i} className="pl-letter overflow-hidden leading-none">
              <span className="block font-serif text-[13vw] md:text-[9vw] tracking-[0.12em] text-on-surface">
                {letter}
              </span>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <p className="pl-sub caps-widest text-primary/50 mt-3 tracking-[0.35em]">
          Diseño de Interiores
        </p>

        {/* Bottom row: line + counter */}
        <div className="absolute bottom-12 left-0 right-0 px-8 md:px-16 flex items-center gap-6">
          <div className="flex-1 h-px bg-primary/10 overflow-hidden">
            <div ref={lineRef} className="h-full bg-primary/40 w-full" />
          </div>
          <span
            ref={counterRef}
            className="font-serif text-sm text-primary/40 tabular-nums w-8 text-right"
          >
            00
          </span>
        </div>
      </div>
    </div>
  )
}

export default Preloader
