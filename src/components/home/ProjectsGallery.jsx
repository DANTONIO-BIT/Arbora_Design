import { useRef, useState, useEffect, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

gsap.registerPlugin(ScrollTrigger)

// Static fallback — shown until real projects are uploaded via the dashboard
const STATIC_FALLBACK = [
  {
    slug: 'residencia-terra',
    display: ['Residencia', 'Terra'],
    loc: 'Las Condes — 2024',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85',
  },
  {
    slug: 'cocina-nordica-vitacura',
    display: ['Cocina', 'Nórdica'],
    loc: 'Vitacura — 2024',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85',
  },
  {
    slug: 'casa-los-trapenses',
    display: ['Casa', 'Lumière'],
    loc: 'Lo Barnechea — 2025',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85',
  },
  {
    slug: 'dormitorio-principal-providencia',
    display: ['Reforma', 'Manquehue'],
    loc: 'Vitacura — 2025',
    img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=85',
  },
  {
    slug: 'living-comedor-maipu',
    display: ['Apartamento', 'El Golf'],
    loc: 'Las Condes — 2026',
    img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1800&q=85',
  },
]

// Split "Residencia Terra" → ["Residencia", "Terra"] for italic accent
const splitTitle = (title) => {
  const parts = title.trim().split(' ')
  if (parts.length <= 1) return [title, '']
  const last = parts.pop()
  return [parts.join(' '), last]
}

// Normalize a Supabase project row into the carousel item shape
const toGalleryItem = (project) => {
  const year = new Date(project.created_at).getFullYear()
  const loc = project.location ? `${project.location} — ${year}` : String(year)
  return {
    slug: project.slug,
    display: splitTitle(project.title),
    loc,
    img: project.images?.[0] ?? STATIC_FALLBACK[0].img,
  }
}

// Fraction of the track's width between two adjacent card centers
const CARD_STEP = 0.34
const SETTLE_DURATION = 0.65

const ProjectsGallery = () => {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const progress = useRef(0) // continuous carousel position — mutable, not React state
  const dragState = useRef(null)
  const wheelIdleTimer = useRef(null)

  const [items, setItems] = useState(STATIC_FALLBACK)
  const [ready, setReady] = useState(false)

  // Fetch featured projects from Supabase; fall back to static if none exist yet
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('slug, title, location, images, created_at')
        .eq('featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5)

      if (!error && data && data.length > 0) {
        const mapped = data.map(toGalleryItem)
        const padded = [...mapped, ...STATIC_FALLBACK.slice(mapped.length)].slice(0, 5)
        setItems(padded)
      }
      setReady(true)
    }

    load()
  }, [])

  const clamp = useCallback((v) => Math.max(0, Math.min(items.length - 1, v)), [items.length])

  // Imperatively positions every card along the arc based on `progress` —
  // avoids a React re-render per drag/scroll frame.
  const render = useCallback(() => {
    const p = progress.current
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const offset = i - p
      const absOffset = Math.abs(offset)
      const scale = Math.max(1 - absOffset * 0.22, 0.5)
      const opacity = Math.max(1 - absOffset * 0.35, 0)
      const x = offset * CARD_STEP * 100
      const y = Math.min(absOffset * 22, 70)
      const rotY = Math.max(Math.min(offset * -12, 34), -34)
      const rotZ = Math.max(Math.min(offset * 3, 10), -10)
      const z = 100 - Math.round(absOffset * 10)

      el.style.transform =
        `translateX(-50%) translate3d(${x}%, ${y}px, 0) scale(${scale}) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`
      el.style.opacity = String(opacity)
      el.style.zIndex = String(z)
      el.style.pointerEvents = absOffset < 2.5 ? 'auto' : 'none'
    })
  }, [])

  useEffect(() => { render() }, [items, render])

  const settleTo = useCallback((target) => {
    gsap.killTweensOf(progress)
    gsap.to(progress, {
      current: clamp(target),
      duration: SETTLE_DURATION,
      ease: 'power3.out',
      onUpdate: render,
    })
  }, [clamp, render])

  // Wheel — scoped to the carousel only; preventDefault stops the page from
  // scrolling while the pointer is over it, so scrolling here always means
  // "move between projects", never "scroll the page".
  const handleWheel = (e) => {
    e.preventDefault()
    gsap.killTweensOf(progress)
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    progress.current = clamp(progress.current + delta * 0.0018)
    render()
    clearTimeout(wheelIdleTimer.current)
    wheelIdleTimer.current = setTimeout(() => settleTo(Math.round(progress.current)), 120)
  }

  // Pointer drag — desktop mouse-drag and touch swipe, same handler
  const handlePointerDown = (e) => {
    gsap.killTweensOf(progress)
    dragState.current = { startX: e.clientX, startProgress: progress.current }
    trackRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!dragState.current) return
    const dx = e.clientX - dragState.current.startX
    const width = trackRef.current?.offsetWidth || 1
    progress.current = clamp(dragState.current.startProgress - dx / (width * CARD_STEP))
    render()
  }

  const handlePointerUp = () => {
    if (!dragState.current) return
    dragState.current = null
    settleTo(Math.round(progress.current))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') settleTo(Math.round(progress.current) + 1)
    if (e.key === 'ArrowLeft') settleTo(Math.round(progress.current) - 1)
  }

  // Clicking a side card brings it to center instead of navigating;
  // clicking the already-centered card navigates to the project page.
  const handleCardClick = (e, index) => {
    const centered = Math.round(progress.current) === index
    if (!centered) {
      e.preventDefault()
      settleTo(index)
    }
  }

  useGSAP(() => {
    if (!ready) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from(headRef.current, {
      y: 30,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
    })

    gsap.from(trackRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: trackRef.current, start: 'top 90%' },
    })
  }, { scope: sectionRef, dependencies: [ready] })

  return (
    <section ref={sectionRef} className="bg-surface py-20 pb-36 overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div ref={headRef} className="pgal-head flex justify-between items-baseline mb-16">
          <h3 className="font-serif font-light text-[clamp(36px,5vw,72px)] tracking-[-0.01em] leading-[1] text-on-surface">
            Proyectos<br />
            <em className="italic font-light">seleccionados</em>
          </h3>
          <span className="text-[11px] uppercase tracking-[0.28em] text-on-surface-variant hidden md:block">
            [ 02 ] 2023 — 2026
          </span>
        </div>

        {/* Arc carousel — scroll/drag over it moves between projects */}
        <div
          ref={trackRef}
          role="region"
          aria-label="Carrusel de proyectos seleccionados"
          tabIndex={0}
          className="relative h-[440px] md:h-[540px] select-none touch-none cursor-grab active:cursor-grabbing outline-none"
          style={{ perspective: '1600px' }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          {items.map((item, i) => (
            <Link
              key={item.slug}
              to={`/proyectos/${item.slug}`}
              ref={(el) => { cardRefs.current[i] = el }}
              onClick={(e) => handleCardClick(e, i)}
              draggable={false}
              className="absolute top-0 left-1/2 w-[64%] md:w-[36%]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="aspect-[4/5] overflow-hidden bg-surface-container shadow-xl">
                <img
                  src={item.img}
                  alt={item.display.join(' ')}
                  draggable={false}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-serif font-light text-[19px] tracking-[-0.005em] text-on-surface">
                  {item.display[0]}{' '}
                  <em className="italic text-primary">{item.display[1]}</em>
                </h4>
                <span className="font-serif italic text-[13px] text-on-surface-variant">
                  {item.loc}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.28em] text-on-surface-variant/70">
          Desliza o desplázate sobre los proyectos para navegar
        </p>

        {/* Ghost CTA */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/proyectos"
            className="font-serif italic text-[22px] text-on-surface border-b border-current pb-1 transition-opacity duration-200 hover:opacity-60"
          >
            Ver todos los proyectos →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProjectsGallery
