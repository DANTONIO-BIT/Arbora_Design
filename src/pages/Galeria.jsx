import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Viewer3D from '../components/home/Viewer3D'

const Galeria = () => {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [galleryItems, setGalleryItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      const { data: cats } = await supabase.from('categories').select('*').order('name')
      if (cats) setCategories(cats)
      
      const { data: gal, error: galError } = await supabase
        .from('gallery')
        .select('*, categories(name)')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (galError) setError(galError.message)
      else setGalleryItems(gal || [])

      setLoading(false)
    }
    
    fetchData()
  }, [])

  const categoryNames = ['Todos', ...categories.map(c => c.name)]

  const filteredGallery = activeCategory === 'Todos' 
    ? galleryItems 
    : galleryItems.filter(item => item.categories?.name === activeCategory)

  useGSAP(() => {
    gsap.fromTo('.gallery-item', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
    )
  }, [activeCategory, loading]) // added loading dependency

  const openLightbox = (item) => {
    setSelectedItem(item)
    setCurrentMediaIndex(0)
  }

  const closeLightbox = () => {
    setSelectedItem(null)
  }

  const getMediaList = (item) => {
    if (!item) return []
    // Combine images array (or fallback image_url) and model_url
    const images = item.images && item.images.length > 0 ? item.images : (item.image_url ? [item.image_url] : [])
    const models = item.model_url ? [{ type: '3d', url: item.model_url }] : []
    
    return [
      ...images.map(url => ({ type: 'image', url })),
      ...models
    ]
  }

  const handleNext = (e) => {
    e.stopPropagation()
    const list = getMediaList(selectedItem)
    setCurrentMediaIndex(prev => (prev + 1) % list.length)
  }

  const handlePrev = (e) => {
    e.stopPropagation()
    const list = getMediaList(selectedItem)
    setCurrentMediaIndex(prev => (prev - 1 + list.length) % list.length)
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-surface">
      {/* Header */}
      <section className="section-padding pt-48 pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="caps-widest text-primary mb-6 block">Galería</span>
            <h1 className="font-serif">Explora nuestro <br /><span className="italic">trabajo visual.</span></h1>
            <p className="text-on-surface-variant mt-6 max-w-xl font-light">
              Una selección de imágenes, renders y detalles de nuestros proyectos. 
              Click en cualquier imagen para ver en detalle.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
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

      {/* Grid de galería */}
      <section className="section-padding pt-0 pb-24">
        <div className="container-custom">
          {error ? (
            <div className="text-center py-40">
              <p className="text-red-500 text-sm font-mono bg-red-50 px-4 py-3 rounded inline-block">Error: {error}</p>
            </div>
          ) : loading ? (
            <div className="text-center py-40">
              <p className="text-on-surface-variant">Cargando galería...</p>
            </div>
          ) : filteredGallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  className="gallery-item group relative aspect-square overflow-hidden cursor-pointer bg-surface-variant"
                  onClick={() => openLightbox(item)}
                >
                  {item.image_url ? (
                    <img
                      alt={item.title}
                      src={item.image_url}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-primary/40">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
                      <span className="text-[10px] uppercase tracking-widest">Modelo 3D</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                  
                  {/* Badges for multiple media */}
                  <div className="absolute top-4 right-4 flex gap-1 z-10">
                    {item.images?.length > 1 && (
                      <div className="bg-black/60 text-white text-[9px] px-2 py-1 rounded-sm backdrop-blur-sm shadow-lg">
                        {item.images.length} Fotos
                      </div>
                    )}
                    {item.model_url && (
                      <div className="bg-primary/80 text-white text-[9px] px-2 py-1 rounded-sm backdrop-blur-sm shadow-lg">
                        3D
                      </div>
                    )}
                  </div>

                  {/* Overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-xs font-bold uppercase tracking-widest">{item.title}</p>
                    <p className="text-white/70 text-[10px] uppercase tracking-wider">{item.categories?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40">
              <p className="text-on-surface-variant font-light italic">No hay imágenes en esta categoría.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedItem && (() => {
        const mediaList = getMediaList(selectedItem)
        const currentMedia = mediaList[currentMediaIndex]

        return (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={closeLightbox}
          >
            <div className="flex justify-between items-center p-6 text-white absolute top-0 w-full z-10 bg-gradient-to-b from-black/50 to-transparent">
              <div>
                <h3 className="font-serif text-xl">{selectedItem.title}</h3>
                <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">{selectedItem.categories?.name}</p>
              </div>
              <button className="text-white/50 hover:text-white text-4xl p-2" onClick={closeLightbox}>×</button>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative px-12" onClick={(e) => e.stopPropagation()}>
              {/* Media Content */}
              <div className="w-full h-full max-h-[80vh] flex items-center justify-center relative">
                {currentMedia?.type === 'image' && (
                  <img
                    key={currentMedia.url}
                    alt={selectedItem.title}
                    src={currentMedia.url}
                    className="max-w-full max-h-full object-contain animate-fadeIn"
                  />
                )}
                {currentMedia?.type === '3d' && (
                  <div className="w-full h-full max-w-5xl rounded-lg overflow-hidden bg-white/5 animate-fadeIn">
                    <Viewer3D modelUrl={currentMedia.url} />
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {mediaList.length > 1 && (
                <>
                  <button 
                    onClick={handlePrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    ←
                  </button>
                  <button 
                    onClick={handleNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Media Indicators */}
            {mediaList.length > 1 && (
              <div className="pb-8 flex justify-center gap-2 z-10" onClick={e => e.stopPropagation()}>
                {mediaList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentMediaIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentMediaIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })()}
    </main>
  )
}

export default Galeria