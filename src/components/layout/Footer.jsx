import { Link } from 'react-router-dom'

// Editorial dark footer — McAlpine-style oversized uppercase brand,
// uppercase tracked labels, italic-on-hover links.
const Footer = () => {
  const currentYear = new Date().getFullYear()

  const sections = {
    navegar: [
      { to: '/proyectos', label: 'Proyectos' },
      { to: '/galeria',   label: 'Galería' },
      { to: '/servicios', label: 'Servicios' },
      { to: '/about',     label: 'Estudio' },
      { to: '/contacto',  label: 'Contacto' },
    ],
    estudio: [
      { to: 'mailto:hola@arborahogar.com', label: 'hola@arborahogar.com', external: true },
      { to: 'tel:+56900000000',            label: '+56 9 0000 0000',     external: true },
      { to: '#',                           label: 'Santiago de Chile' },
    ],
    sociales: [
      { to: 'https://instagram.com', label: 'Instagram', external: true },
      { to: 'https://pinterest.com', label: 'Pinterest', external: true },
      { to: 'https://behance.net',   label: 'Behance',   external: true },
    ],
  }

  // Renders a link with italic hover treatment, supports external targets
  const FooterLink = ({ to, label, external }) =>
    external ? (
      <a
        href={to}
        target={to.startsWith('http') ? '_blank' : undefined}
        rel={to.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-inverse-on-surface/85 hover:text-primary-container transition-colors text-[15px] font-light tracking-wide hover:italic"
      >
        {label}
      </a>
    ) : (
      <Link
        to={to}
        className="text-inverse-on-surface/85 hover:text-primary-container transition-colors text-[15px] font-light tracking-wide hover:italic"
      >
        {label}
      </Link>
    )

  return (
    <footer
      data-nav-theme="dark"
      className="bg-[#14130d] text-inverse-on-surface pt-28 md:pt-32 pb-8 overflow-hidden"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-12 pb-20 border-b border-inverse-on-surface/15">
          {/* Brand column */}
          <div className="md:col-span-5 space-y-8">
            <Link to="/" className="inline-block group" aria-label="Arbora — inicio">
              <span className="font-display uppercase text-5xl md:text-6xl xl:text-7xl tracking-[0.03em] leading-none group-hover:text-primary transition-colors">
                Arbora
              </span>
            </Link>
            <p className="text-inverse-on-surface/70 text-[15px] font-light leading-relaxed max-w-md">
              Estudio de interiorismo y muebles a medida en Santiago de Chile.
              Una práctica artesanal, atendiendo un número limitado de proyectos al año.
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] border border-inverse-on-surface/25 text-inverse-on-surface px-6 py-3.5 rounded-full hover:bg-inverse-on-surface hover:text-[#14130d] transition-colors duration-300"
            >
              Agendar visita
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Three link columns */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-8">
            <div className="space-y-7">
              <h5 className="text-[10px] uppercase tracking-[0.32em] text-inverse-on-surface-muted font-normal">
                Navegar
              </h5>
              <ul className="space-y-3">
                {sections.navegar.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-7">
              <h5 className="text-[10px] uppercase tracking-[0.32em] text-inverse-on-surface-muted font-normal">
                Estudio
              </h5>
              <ul className="space-y-3">
                {sections.estudio.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-7">
              <h5 className="text-[10px] uppercase tracking-[0.32em] text-inverse-on-surface-muted font-normal">
                Síguenos
              </h5>
              <ul className="space-y-3">
                {sections.sociales.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] uppercase tracking-[0.28em] text-inverse-on-surface/45">
          <span>© {currentYear} Arbora Hogar — Todos los derechos reservados</span>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-inverse-on-surface transition-colors">Aviso legal</Link>
            <Link to="#" className="hover:text-inverse-on-surface transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
