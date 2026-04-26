import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import Viewer3D from '../components/home/Viewer3D'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const ProyectoDetalle = () => {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*, categories(name)')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error) {
        console.error('Error fetching project:', error)
      } else {
        setProject(data)
      }
      setLoading(false)
    }

    fetchProject()
  }, [slug])

  useGSAP(() => {
    if (!project) return
    
    gsap.fromTo('.reveal', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
    )

    gsap.fromTo('.parallax-img', 
      { scale: 1.1 },
      { scale: 1, duration: 2, ease: 'power2.out' }
    )
  }, { scope: containerRef, dependencies: [project] })

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-6 bg-white">
        <div className="space-y-4">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-on-surface-variant font-light italic">Cargando espacio...</p>
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-6 bg-white">
        <div className="space-y-6">
          <h1 className="text-4xl font-serif">Proyecto no encontrado</h1>
          <p className="text-on-surface-variant font-light">El espacio que buscas no está disponible actualmente.</p>
          <Link to="/proyectos">
            <Button variant="outline">Volver a Proyectos</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main ref={containerRef} className="bg-white">
      {/* Hero Section */}
      <section className="h-[90vh] relative overflow-hidden bg-black">
        {project.images?.[0] && (
          <img
            alt={project.title}
            src={project.images[0]}
            className="parallax-img w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-20 left-0 w-full">
          <div className="container-custom">
            <div className="max-w-4xl space-y-6 reveal">
              <span className="caps-widest text-white/60 block">{project.categories?.name}</span>
              <h1 className="text-white text-6xl md:text-8xl font-serif leading-tight">
                {project.title}
              </h1>
              {/* Note: Subtitle is not in DB, using a placeholder or omitting */}
              <p className="text-white/80 text-2xl font-light italic">
                {project.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meta Info & Introduction */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-12 reveal">
              <div className="space-y-8 pt-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Ubicación</span>
                  <p className="text-xl font-light">{project.location}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Superficie</span>
                  <p className="text-xl font-light">{project.area}m²</p>
                </div>
                {/* Year is not in DB schema, omitting or using creation date year */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Año</span>
                  <p className="text-xl font-light">{new Date(project.created_at).getFullYear()}</p>
                </div>
              </div>
              
              {/* Note: Services are not in DB, omitting or adding as static for now */}
              <div className="pt-8 border-t border-primary/10">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary block mb-6">Categoría</span>
                <div className="flex flex-wrap gap-3">
                  <span className="text-xs font-medium px-4 py-2 bg-surface-variant rounded-full text-primary/70">
                    {project.categories?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Narrative */}
            <div className="lg:col-span-8 space-y-12 reveal">
              <h2 className="text-4xl font-serif leading-snug">
                El concepto: <br />
                <span className="italic">
                  {project.concept || 'La esencia del espacio.'}
                </span>
              </h2>
              <div className="space-y-8 text-on-surface-variant text-xl font-light leading-relaxed">
                <p>{project.description}</p>
                <p>{project.story}</p>
              </div>
              <div className="pt-8">
                <Link to="/contacto">
                  <Button variant="primary" className="px-12">
                    Iniciar Proyecto Similar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Experience (if available) */}
      {project.has_model && project.model_url && (
        <section className="section-padding py-0">
          <div className="container-custom">
            <div className="reveal space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="caps-widest text-primary block">Experiencia Inmersiva</span>
                <h2 className="text-4xl font-serif">Explora el espacio en 3D</h2>
                <p className="text-on-surface-variant font-light">
                  Utiliza nuestro visor interactivo para recorrer cada rincón diseñado.
                </p>
              </div>
              <div className="aspect-video bg-surface-variant overflow-hidden rounded-sm shadow-2xl">
                <Viewer3D modelUrl={project.model_url} fallbackImage={project.images?.[0]} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {project.images?.map((img, i) => (
              <div 
                key={i} 
                className={`reveal group overflow-hidden rounded-sm bg-surface-variant shadow-sm
                  ${i % 3 === 0 ? 'md:col-span-2' : ''}`}
              >
                <img
                  alt={`${project.title} - Imagen ${i + 1}`}
                  src={img}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Navigation */}
      <section className="py-24 border-t border-primary/5">
        <div className="container-custom flex justify-between items-center">
          <Link to="/proyectos" className="group flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"/>
              </svg>
            </div>
            <span className="caps-widest text-primary/60 group-hover:text-primary transition-colors">Volver al Portfolio</span>
          </Link>
        </div>
      </section>
    </main>
  )
}

export default ProyectoDetalle