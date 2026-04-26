import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Proyectos = () => {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      // Fetch categories
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (cats) setCategories(cats)
      
      // Fetch projects (only published)
      const { data: projs, error: projError } = await supabase
        .from('projects')
        .select('*, categories(name)')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (projError) {
        setError(projError.message)
      } else {
        setProjects(projs || [])
      }

      setLoading(false)
    }
    
    fetchData()
  }, [])

  const filteredProjects = activeCategory === 'Todos' 
    ? projects 
    : projects.filter(p => p.categories?.name === activeCategory)

  useGSAP(() => {
    const cards = gsap.utils.toArray('.project-card')
    if (cards.length === 0) return
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all',
      }
    )
  }, { scope: containerRef, dependencies: [activeCategory, projects.length] })

  const categoryNames = ['Todos', ...categories.map(c => c.name)]

  return (
    <main ref={containerRef} className="bg-white min-h-screen">
      {/* Header */}
      <section className="section-padding pt-48 pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="caps-widest text-primary mb-6 block">Portfolio</span>
            <h1 className="font-serif">Explora nuestras <br /><span className="italic">últimas creaciones.</span></h1>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="pb-12">
        <div className="container-custom">
          <div className="flex flex-wrap gap-8 border-b border-primary/10 pb-8">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative pb-2 
                  ${activeCategory === cat ? 'text-primary' : 'text-primary/40 hover:text-primary'}`}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          {error ? (
            <div className="text-center py-40">
              <p className="text-red-500 text-sm font-mono bg-red-50 px-4 py-3 rounded inline-block">Error: {error}</p>
            </div>
          ) : loading ? (
            <div className="text-center py-40">
              <p className="text-on-surface-variant">Cargando proyectos...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-24">
              {filteredProjects.map((project, i) => (
                <Link
                  key={project.id}
                  to={`/proyectos/${project.slug}`}
                  className={`project-card group space-y-8 
                    ${i % 3 === 0 ? 'lg:col-span-7' : 'lg:col-span-5'} 
                    ${i % 2 === 1 ? 'lg:mt-32' : ''}`}
                >
                  <div className="aspect-[4/5] bg-surface-variant overflow-hidden rounded-sm relative shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    {project.images?.[0] ? (
                      <img
                        alt={project.title}
                        src={project.images[0]}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-variant text-primary/30">
                        <span className="text-xs uppercase tracking-widest">Sin imagen</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Hover Info */}
                    <div className="absolute bottom-10 left-10 right-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-white text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">
                        Ver Proyecto
                      </span>
                      <div className="h-[1px] w-full bg-white/30" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-3xl font-serif">{project.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
                        {project.area ? `${project.area}m²` : ''}
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary/60">
                      {project.categories?.name} · {project.location}
                    </p>
                    <p className="text-on-surface-variant font-light leading-relaxed max-w-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-40">
              <p className="text-on-surface-variant font-light italic">No hay proyectos que coincidan con esta selección.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Proyectos