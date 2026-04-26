import { useRef, useState, useEffect } from 'react'
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

// Asymmetric 12-column layout — positions fixed regardless of content
const LAYOUT = [
  { col: 'col-span-12 md:col-start-1 md:col-span-7', cover: 'aspect-[4/5]',   extra: '' },
  { col: 'col-span-12 md:col-start-9 md:col-span-4', cover: 'aspect-[3/4]',   extra: 'md:self-end md:pb-10' },
  { col: 'col-span-12 md:col-start-2 md:col-span-4', cover: 'aspect-[3/4]',   extra: 'md:mt-10' },
  { col: 'col-span-12 md:col-start-7 md:col-span-6', cover: 'aspect-[16/11]', extra: 'md:-mt-16' },
  { col: 'col-span-12 md:col-start-3 md:col-span-8', cover: 'aspect-[16/9]',  extra: 'md:mt-16' },
]

// Split "Residencia Terra" → ["Residencia", "Terra"] for italic accent
const splitTitle = (title) => {
  const parts = title.trim().split(' ')
  if (parts.length <= 1) return [title, '']
  const last = parts.pop()
  return [parts.join(' '), last]
}

// Normalize a Supabase project row into the gallery item shape
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

const ProjectsGallery = () => {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)
  const gridRef    = useRef(null)
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
        // Pad to 5 with fallback entries if fewer projects exist
        const mapped = data.map(toGalleryItem)
        const padded = [
          ...mapped,
          ...STATIC_FALLBACK.slice(mapped.length),
        ].slice(0, 5)
        setItems(padded)
      }
      // If error or empty, keep static fallback already set
      setReady(true)
    }

    load()
  }, [])

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

    if (gridRef.current) {
      gsap.from(gridRef.current.querySelectorAll('.pgal-card'), {
        y: 40,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 90%' },
      })
    }
  }, { scope: sectionRef, dependencies: [ready] })

  return (
    <section ref={sectionRef} className="bg-surface py-20 pb-36">
      <div className="container-custom">
        {/* Header */}
        <div ref={headRef} className="pgal-head flex justify-between items-baseline mb-20">
          <h3 className="font-serif font-light text-[clamp(36px,5vw,72px)] tracking-[-0.01em] leading-[1] text-on-surface">
            Proyectos<br />
            <em className="italic font-light">seleccionados</em>
          </h3>
          <span className="text-[11px] uppercase tracking-[0.28em] text-on-surface-variant hidden md:block">
            [ 02 ] 2023 — 2026
          </span>
        </div>

        {/* Asymmetric grid */}
        <div ref={gridRef} className="pgal-grid grid grid-cols-12 gap-x-7 gap-y-8">
          {items.map((item, i) => {
            const layout = LAYOUT[i]
            return (
              <article key={item.slug} className={`pgal-card ${layout.col} ${layout.extra}`}>
                <Link to={`/proyectos/${item.slug}`} className="group block">
                  <div className={`${layout.cover} overflow-hidden bg-surface-container`}>
                    <img
                      loading="lazy"
                      src={item.img}
                      alt={item.display.join(' ')}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex justify-between items-baseline pt-5">
                    <h4 className="font-serif font-light text-[22px] tracking-[-0.005em] text-on-surface">
                      {item.display[0]}{' '}
                      <em className="italic text-primary">{item.display[1]}</em>
                    </h4>
                    <span className="font-serif italic text-[14px] text-on-surface-variant">
                      {item.loc}
                    </span>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>

        {/* Ghost CTA */}
        <div className="mt-24 flex justify-center">
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
