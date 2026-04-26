import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

const About = () => {
  const containerRef = useRef(null)

  useGSAP(() => {
    gsap.from('.reveal', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })
  }, { scope: containerRef })

  const team = [
    {
      name: 'María José Smith',
      role: 'Directora de Diseño',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
      bio: 'Arquitecta con +15 años de experiencia en residential design. Formación en Universidad Católica y Master en Interiorismo en IED Barcelona.',
    },
    {
      name: 'Pedro Ruiz',
      role: 'Director de Proyecto',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      bio: 'Ingeniero civil, MBA en Universidad de Chile. Especializado en gestión de obra y coordinación de gremios.',
    },
  ]

  return (
    <main ref={containerRef} className="bg-white">
      {/* Hero Section */}
      <section className="section-padding pt-48">
        <div className="container-custom">
          <div className="max-w-4xl">
            <span className="caps-widest text-primary mb-6 block reveal">Nuestra Historia</span>
            <h1 className="font-serif reveal">Creamos atmósferas que <br /><span className="italic">elevan la consciencia.</span></h1>
            <p className="text-on-surface-variant mt-12 text-2xl font-light leading-relaxed reveal">
              Arbora Hogar nació con una idea simple: hacer accesible el diseño de interiores 
              de calidad premium. No queremos reformar tu casa — queremos transformar 
              tu manera de vivirla.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="section-padding py-0">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7 reveal">
              <div className="aspect-[16/10] overflow-hidden rounded-sm bg-surface-variant shadow-2xl">
                <img 
                  alt="Equipo Arbora Hogar"
                  src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80"
                  className="w-full h-full object-cover grayscale-[20%]"
                />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-8 reveal">
              <h2 className="text-4xl font-serif">El Arte de Habitar</h2>
              <div className="space-y-6 text-on-surface-variant text-lg font-light leading-relaxed">
                <p>
                  Cada proyecto es un diálogo. Escuchamos, preguntamos, y solo entonces proponemos. 
                  Creemos en los materiales nobles, en la luz natural, y en que menos es más cuando se hace bien.
                </p>
                <p>
                  Trabajamos con un equipo fijo de maestros y talleres locales. Conocemos a cada 
                  carpintero por su nombre. Eso nos permite garantizar calidad y plazos cerrados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl mb-24">
            <span className="caps-widest text-primary mb-6 block reveal">El Equipo</span>
            <h2 className="font-serif reveal">Mentes creativas, <br />manos expertas.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 lg:gap-32">
            {team.map((member, i) => (
              <div key={i} className="reveal space-y-8 group">
                <div className="aspect-[4/5] bg-surface-variant overflow-hidden rounded-sm grayscale-[30%] group-hover:grayscale-0 transition-all duration-700">
                  <img
                    alt={member.name}
                    src={member.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    {member.role}
                  </span>
                  <h3 className="text-3xl font-serif">{member.name}</h3>
                  <p className="text-on-surface-variant text-lg font-light leading-relaxed max-w-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-surface-variant/30">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto space-y-12 reveal">
            <h2 className="text-5xl font-serif">¿Hablamos de tu futuro?</h2>
            <p className="text-on-surface-variant text-xl font-light">
              Si tienes un proyecto en mente, nos encantaría conocerlo. 
              Primera consulta estratégica sin compromiso.
            </p>
            <div className="pt-4">
              <Link to="/contacto">
                <Button variant="primary" className="px-12">
                  Agendar reunión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About