import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const plans = [
  {
    name: 'Inspiración',
    tagline: 'Estilismo & Deco',
    description: 'Actualización estética sin obras. Selección de mobiliario, paleta cromática y textiles.',
    features: ['Moodboard personalizado', 'Plano de distribución', 'Shopping list curada'],
    cta: 'Consultar',
  },
  {
    name: 'Evolución',
    tagline: 'Reforma Parcial',
    description: 'Renovación focalizada en estancias clave (Cocina/Baños) para elevar el valor de tu hogar.',
    features: ['Proyecto técnico 3D', 'Gestión de licencias', 'Dirección de obra'],
    cta: 'Presupuestar',
  },
  {
    name: 'Absoluto',
    tagline: 'Reforma Integral',
    description: 'Transformación total. Redistribución de espacios, instalaciones y diseño a medida.',
    features: ['Interiorismo de lujo', 'Mobiliario a medida', 'Entrega llave en mano'],
    cta: 'Agendar Cita',
  },
]

const BudgetSection = () => {
  return (
    <section className="section-padding bg-surface">
      <div className="container-custom">
        <div className="max-w-3xl mb-24">
          <span className="caps-widest text-primary mb-6 block">Inversión</span>
          <h2 className="font-serif text-5xl md:text-6xl">Planes diseñados para tu tranquilidad.</h2>
          <p className="text-on-surface-variant mt-8 text-xl font-light italic">
            "Aceptamos solo 3–4 proyectos nuevos por mes para garantizar la excelencia en cada detalle."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => {
            const isFeatured = i === 1; // "Evolución" is the featured plan
            return (
              <div 
                key={i}
                className={`
                  relative flex flex-col p-10 md:p-12 transition-all duration-700 group
                  ${isFeatured 
                    ? 'bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border-t-4 border-primary scale-105 z-10' 
                    : 'bg-surface-variant/20 border border-primary/5 hover:bg-white hover:shadow-xl hover:border-primary/10'
                  }
                `}
              >
                {isFeatured && (
                  <div className="absolute -top-1 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest left-1/2 -translate-x-1/2">
                    Recomendado
                  </div>
                )}
                
                <div className="flex-grow">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isFeatured ? 'text-primary' : 'text-on-surface-variant/60'}`}>
                    {plan.name}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-serif mt-6 mb-8">{plan.tagline}</h3>
                  <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-10">
                    {plan.description}
                  </p>
                  
                  <ul className="space-y-5 mb-12">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-4 text-sm tracking-wide text-on-surface/80 group-hover:text-on-surface transition-colors">
                        <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Link to="/contacto" className="block">
                    <Button 
                      variant={isFeatured ? 'primary' : 'outline'} 
                      className={`w-full py-6 transition-all duration-500 ${isFeatured ? 'shadow-lg' : ''}`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 pt-12 border-t border-primary/5 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-primary/5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
              Últimas 2 plazas disponibles para el trimestre actual
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BudgetSection