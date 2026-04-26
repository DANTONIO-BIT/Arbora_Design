import { Link, useSearchParams } from 'react-router-dom'
import { services, getServiceBySlug } from '../data/services'
import Button from '../components/ui/Button'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

const Servicios = () => {
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')
  const selectedService = slug ? getServiceBySlug(slug) : null
  const containerRef = useRef(null)

  useGSAP(() => {
    gsap.from('.reveal', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out'
    })
  }, { scope: containerRef, dependencies: [slug] })

  if (selectedService) {
    return (
      <main ref={containerRef} className="bg-white min-h-screen">
        <section className="section-padding pt-48">
          <div className="container-custom">
            <Link 
              to="/servicios" 
              className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 hover:text-primary mb-16 transition-colors group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Volver a Servicios
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
              <div className="lg:col-span-5 space-y-12 reveal">
                <div className="space-y-6">
                  <span className="caps-widest text-primary block">Servicio Especializado</span>
                  <h1 className="font-serif">{selectedService.title}</h1>
                  <p className="text-on-surface-variant text-2xl font-light italic leading-relaxed">
                    {selectedService.tagline}
                  </p>
                </div>
                
                <div className="space-y-8 text-on-surface-variant text-xl font-light leading-relaxed">
                  <p>{selectedService.description}</p>
                </div>

                <div className="pt-8">
                  <Link to="/contacto">
                    <Button variant="primary" className="px-12">
                      Solicitar Presupuesto
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 reveal">
                <div className="aspect-[4/5] bg-surface-variant overflow-hidden rounded-sm shadow-2xl">
                  <img
                    alt={selectedService.title}
                    src={selectedService.image}
                    className="w-full h-full object-cover grayscale-[20%]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-32 pt-20 border-t border-primary/10 reveal">
              <h2 className="text-4xl font-serif mb-16">Metodología y Entregables</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
                {selectedService.details.map((detail, i) => (
                  <div key={i} className="flex gap-6 items-start py-6 border-b border-primary/5">
                    <span className="text-primary font-serif italic text-2xl">0{i + 1}</span>
                    <p className="text-xl font-light text-on-surface-variant">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main ref={containerRef} className="bg-white min-h-screen">
      <section className="section-padding pt-48">
        <div className="container-custom">
          <div className="max-w-3xl mb-32 reveal">
            <span className="caps-widest text-primary mb-6 block">Nuestras Soluciones</span>
            <h1 className="font-serif">Arquitectura de Interiores <br /><span className="italic">con propósito.</span></h1>
            <p className="text-on-surface-variant mt-12 text-2xl font-light leading-relaxed">
              Combinamos visión arquitectónica con una ejecución artesanal para crear hogares 
              que reflejan tu esencia y elevan tu cotidianeidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/servicios?slug=${service.slug}`}
                className="group space-y-8 reveal"
              >
                <div className="aspect-[4/3] bg-surface-variant overflow-hidden rounded-sm relative shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <img
                    alt={service.title}
                    src={service.image}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-serif group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-primary/60 text-sm font-light italic">
                    {service.tagline}
                  </p>
                  <p className="text-on-surface-variant font-light leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                  <div className="pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-primary/20 pb-1">
                      Ver Detalles
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust CTA */}
      <section className="section-padding bg-surface-variant/20">
        <div className="container-custom text-center space-y-12 reveal">
          <h2 className="text-5xl font-serif">¿No encuentras lo que buscas?</h2>
          <p className="text-on-surface-variant text-xl font-light max-w-2xl mx-auto">
            Creamos soluciones a medida para desafíos únicos. Hablemos de tu visión particular.
          </p>
          <div className="pt-4">
            <Link to="/contacto">
              <Button variant="primary" className="px-16">Contáctanos</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Servicios