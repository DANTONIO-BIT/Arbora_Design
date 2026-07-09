// Compact auto-scrolling stat banner — was a full py-32 section, now a thin
// strip so the page stays shorter. Stats are duplicated once so the
// translateX(-50%) loop in the marquee animation repeats seamlessly.
const STATS = [
  { value: '+120', label: 'Proyectos entregados' },
  { value: '8', label: 'Años de práctica' },
  { value: '24h', label: 'Tiempo de respuesta' },
  { value: '4.9/5', label: 'Reseña promedio' },
]

const TrustSection = () => {
  const items = [...STATS, ...STATS]

  return (
    <section className="bg-[#f6f4e3] py-5 overflow-hidden">
      <div className="flex w-max animate-marquee">
        {items.map((stat, i) => (
          <div key={i} className="flex items-center gap-3 px-8 flex-shrink-0">
            <span className="font-serif italic text-primary text-lg leading-none">{stat.value}</span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-on-surface-variant whitespace-nowrap">
              {stat.label}
            </span>
            <span className="text-primary/30 ml-8" aria-hidden>✦</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustSection
