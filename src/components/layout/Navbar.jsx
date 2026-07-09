import { Link, useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState, useEffect } from 'react'

const NAV_LINKS = [
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/galeria',   label: 'Galería' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/about',     label: 'Estudio' },
  { to: '/contacto',  label: 'Contacto' },
]

const Navbar = () => {
  const navRef     = useRef(null)
  const overlayRef = useRef(null)
  const location   = useLocation()
  const [isOpen,     setIsOpen]     = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [onDark,     setOnDark]     = useState(false)

  // Track scroll position for glassmorphic state
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Adaptive light/dark theme based on the section currently under the navbar.
  // Sections opt in by setting data-nav-theme="dark" on their root element.
  useEffect(() => {
    const targets = document.querySelectorAll('[data-nav-theme="dark"]')
    if (!targets.length) {
      setOnDark(false)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Any dark section currently crossing the navbar baseline → dark mode.
        const anyVisible = entries.some((entry) => entry.isIntersecting)
        setOnDark(anyVisible)
      },
      {
        // Sample a 1px-tall band right under the navbar (≈ 90px from top)
        rootMargin: '-90px 0px -100% 0px',
        threshold: 0,
      }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [location.pathname])

  // Navbar entrance animation (runs once on mount)
  useGSAP(() => {
    // GSAP owns the overlay transform — no inline style needed
    gsap.set(overlayRef.current, { yPercent: -100 })

    gsap.from(navRef.current, {
      y: -60,
      opacity: 0,
      duration: 1.1,
      ease: 'power4.out',
      delay: 0.2,
    })
  }, { scope: navRef })

  const openMenu = () => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'

    gsap.killTweensOf(overlayRef.current)
    gsap.fromTo(overlayRef.current,
      { yPercent: -100 },
      { yPercent: 0, duration: 0.85, ease: 'power4.inOut' }
    )
    gsap.fromTo('.nav-ol',
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out', delay: 0.35 }
    )
    gsap.fromTo('.nav-of',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.7 }
    )
  }

  const closeMenu = (onComplete) => {
    gsap.killTweensOf(overlayRef.current)
    gsap.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power4.inOut',
      onComplete: () => {
        setIsOpen(false)
        document.body.style.overflow = ''
        onComplete?.()
      },
    })
  }

  const toggleMenu = () => (isOpen ? closeMenu() : openMenu())

  // Close on route change
  useEffect(() => {
    if (isOpen) closeMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Effective theme: overlay forces dark; otherwise driven by the active section
  const dark = isOpen || onDark

  // Background: transparent at top, glassmorphic when scrolled, transparent again when overlay open
  const barBg =
    isOpen
      ? 'bg-transparent'
      : isScrolled
      ? dark
        ? 'bg-[#14130d]/70 backdrop-blur-[20px]'
        : 'bg-surface/80 backdrop-blur-[20px]'
      : 'bg-transparent'

  const textColor = dark ? 'text-inverse-on-surface' : 'text-on-surface'
  const hamburgerBar = 'block h-px transition-all duration-500 bg-current'

  return (
    <>
      {/* ─── Top bar ─── */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[70] transition-[background,padding,color] duration-500 ${textColor} ${barBg} ${
          isScrolled && !isOpen ? 'py-3.5 md:py-4' : 'py-6 md:py-7'
        }`}
      >
        <div className="container-custom flex justify-between items-center">
          {/* Brand — uppercase display serif */}
          <Link to="/" className="relative z-50 group" aria-label="Arbora — inicio">
            <span className="font-display text-xl md:text-2xl tracking-[0.08em] uppercase leading-none group-hover:text-primary transition-colors">
              Arbora
            </span>
          </Link>

          {/* Hamburger — three lines, refined tracking */}
          <button
            onClick={toggleMenu}
            className="relative z-50 flex flex-col justify-center items-end gap-[5px] w-10 h-9"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
          >
            <span className={`${hamburgerBar} ${isOpen ? 'w-6 rotate-45 translate-y-[6.5px]' : 'w-7'}`} />
            <span className={`${hamburgerBar} ${isOpen ? 'w-6 opacity-0' : 'w-4 opacity-100'}`} />
            <span className={`${hamburgerBar} ${isOpen ? 'w-6 -rotate-45 -translate-y-[6.5px]' : 'w-6'}`} />
          </button>
        </div>
      </nav>

      {/* ─── Full-screen overlay menu ─── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[60] flex flex-col justify-between px-6 md:px-16 xl:px-24 pt-32 md:pt-36 pb-12"
        style={{ backgroundColor: 'var(--color-inverse-surface-deep)' }}
      >
        {/* Top label inside overlay */}
        <div className="nav-of absolute top-32 right-6 md:right-16 xl:right-24 hidden md:block">
          <span className="text-[10px] uppercase tracking-[0.32em] text-inverse-on-surface-muted">
            [ Menu / 2026 ]
          </span>
        </div>

        {/* Nav links — oversized serif, lowercase */}
        <nav className="mt-4 max-w-5xl">
          {NAV_LINKS.map((link, i) => (
            <div key={link.to} className="nav-ol overflow-hidden">
              <Link
                to={link.to}
                className="group flex items-baseline gap-6 md:gap-10 py-3 md:py-4"
                onClick={() => closeMenu()}
              >
                <span className="w-10 font-serif italic text-sm text-inverse-on-surface-muted flex-shrink-0 pt-3">
                  0{i + 1}
                </span>
                <span className="font-serif font-light text-[2.8rem] md:text-7xl xl:text-8xl text-inverse-on-surface leading-[1.05] tracking-[-0.015em] lowercase transition-colors duration-300 group-hover:text-primary-container">
                  {link.label.toLowerCase()}
                </span>
              </Link>
            </div>
          ))}
        </nav>

        {/* Footer row inside overlay */}
        <div className="nav-of grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-end mt-12">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.32em] text-inverse-on-surface-muted">
              Contacto directo
            </p>
            <a
              href="mailto:hola@arborahogar.com"
              className="block font-serif italic text-2xl md:text-3xl text-inverse-on-surface hover:text-primary-container transition-colors"
            >
              hola@arborahogar.com
            </a>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.32em] text-inverse-on-surface-muted">
              Estudio
            </p>
            <p className="text-inverse-on-surface/80 text-base font-light leading-snug">
              Santiago de Chile<br />
              Lun — Vie · 10:00 a 19:00
            </p>
          </div>

          <div className="md:justify-self-end">
            <Link
              to="/contacto"
              className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] border border-inverse-on-surface/30 text-inverse-on-surface px-7 py-4 rounded-full hover:bg-inverse-on-surface hover:text-inverse-surface-deep transition-colors duration-300"
              onClick={() => closeMenu()}
            >
              Agendar visita
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
