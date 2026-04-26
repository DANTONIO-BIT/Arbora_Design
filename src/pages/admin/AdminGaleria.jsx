import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { sanitizeFileName } from '../../lib/utils'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminGaleria = () => {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    images: [], // array of File objects
    modelFile: null // File object
  })
  const [previewImages, setPreviewImages] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [{ data: gal }, { data: cats }] = await Promise.all([
      supabase.from('gallery').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    if (gal) setItems(gal)
    if (cats) setCategories(cats)
    setLoading(false)
  }

  // ── Upload Form ──────────────────────────────────────

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (formData.images.length + files.length > 5) {
      alert('Máximo 5 imágenes permitidas por post.')
      return
    }
    
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
    
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setPreviewImages(prev => [...prev, ...newPreviews])
    
    e.target.value = ''
  }

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images]
      newImages.splice(index, 1)
      return { ...prev, images: newImages }
    })
    setPreviewImages(prev => {
      URL.revokeObjectURL(prev[index])
      const newPreviews = [...prev]
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const handleModelSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.toLowerCase().endsWith('.glb')) {
        alert('El archivo debe ser formato .glb')
        e.target.value = ''
        return
      }
      setFormData(prev => ({ ...prev, modelFile: file }))
    }
  }

  const removeModel = () => {
    setFormData(prev => ({ ...prev, modelFile: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.images.length === 0 && !formData.modelFile) {
      alert('Debes subir al menos una imagen o un modelo 3D.')
      return
    }

    setUploading(true)

    try {
      const imageUrls = []
      let modelUrl = null

      // Upload Images
      for (const file of formData.images) {
        const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`
        const { error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, file, { upsert: false })

        if (uploadError) throw new Error(`Error subiendo imagen: ${uploadError.message}`)

        const { data: urlData } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(fileName)
        
        imageUrls.push(urlData.publicUrl)
      }

      // Upload Model
      if (formData.modelFile) {
        const fileName = `${Date.now()}-${sanitizeFileName(formData.modelFile.name)}`
        const { error: uploadError } = await supabase.storage
          // Subimos el GLB al bucket project-models que ya tiene RLS configurado para esto
          .from('project-models')
          .upload(fileName, formData.modelFile, { upsert: false })

        if (uploadError) throw new Error(`Error subiendo modelo 3D: ${uploadError.message}`)

        const { data: urlData } = supabase.storage
          .from('project-models')
          .getPublicUrl(fileName)
        
        modelUrl = urlData.publicUrl
      }

      // We maintain image_url as the first image for backwards compatibility and easy thumbnails
      const firstImage = imageUrls.length > 0 ? imageUrls[0] : null

      const { error: insertError } = await supabase.from('gallery').insert({
        title: formData.title || 'Sin Título',
        category_id: formData.category_id || null,
        image_url: firstImage, // Thumbnail principal
        images: imageUrls,     // Array con todas las imágenes
        model_url: modelUrl,   // URL del modelo 3D
        published: true,
      })

      if (insertError) throw new Error(`DB insert error: ${insertError.message}`)

      // Reset form
      setFormData({ title: '', category_id: '', images: [], modelFile: null })
      setPreviewImages([])
      setIsFormOpen(false)
      fetchData()

    } catch (err) {
      console.error('Upload error:', err)
      alert(err.message)
    }

    setUploading(false)
  }

  // ── Existing items ────────────────────────────────────

  const updateItemField = async (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
    await supabase.from('gallery').update({ [field]: value }).eq('id', id)
  }

  const deleteItem = async (id) => {
    if (!confirm('¿Eliminar esta publicación?')) return
    await supabase.from('gallery').delete().eq('id', id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const filteredItems = items.filter((item) => {
    if (filter === 'published') return item.published
    if (filter === 'draft') return !item.published
    return true
  })

  const counts = {
    all: items.length,
    published: items.filter((i) => i.published).length,
    draft: items.filter((i) => !i.published).length,
  }

  const actions = (
    <button
      onClick={() => setIsFormOpen(!isFormOpen)}
      className="bg-primary text-on-primary px-5 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
    >
      {isFormOpen ? 'Cancelar' : '+ Nuevo Post'}
    </button>
  )

  return (
    <AdminLayout title="Galería" actions={actions}>

      {/* Upload Form */}
      {isFormOpen && (
        <div className="bg-white border border-primary/10 rounded-sm p-8 mb-12 shadow-sm">
          <h2 className="text-xl font-serif mb-6">Crear Publicación de Galería</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Título (Opcional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full border-b border-primary/20 py-2 bg-transparent focus:outline-none focus:border-primary"
                  placeholder="Ej: Detalles de Iluminación"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Categoría</label>
                <select
                  value={formData.category_id}
                  onChange={e => setFormData(p => ({ ...p, category_id: e.target.value }))}
                  className="w-full border-b border-primary/20 py-2 bg-transparent focus:outline-none focus:border-primary"
                >
                  <option value="">Sin Categoría</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                  Imágenes ({formData.images.length}/5)
                </label>
                <label className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                  + Añadir Imágenes
                  <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>
              </div>
              
              {previewImages.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {previewImages.map((src, i) => (
                    <div key={i} className="relative w-32 h-32 flex-shrink-0 bg-surface-variant rounded-sm overflow-hidden group">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 border-2 border-dashed border-primary/20 rounded-sm flex items-center justify-center text-primary/40 text-xs">
                  Ninguna imagen seleccionada
                </div>
              )}
            </div>

            {/* 3D Model Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 block">Modelo 3D (.glb) Opcional</label>
              
              {formData.modelFile ? (
                <div className="flex items-center justify-between bg-surface-variant p-4 rounded-sm border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
                    </div>
                    <span className="text-xs font-medium">{formData.modelFile.name}</span>
                  </div>
                  <button type="button" onClick={removeModel} className="text-red-500 text-xs hover:underline">Eliminar</button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="h-20 border-2 border-dashed border-primary/20 rounded-sm flex items-center justify-center text-primary/40 text-xs hover:bg-surface-variant/50 transition-colors">
                    + Seleccionar archivo .glb
                  </div>
                  <input type="file" accept=".glb" onChange={handleModelSelect} className="hidden" />
                </label>
              )}
            </div>

            <div className="pt-6 border-t border-primary/10 flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary text-white px-12 py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {uploading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                {uploading ? 'Subiendo y Guardando...' : 'Publicar en Galería'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-8 border-b border-primary/10 mb-6">
        {[
          ['all', 'Todas'],
          ['published', 'Publicadas'],
          ['draft', 'Borradores'],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`text-[10px] font-bold uppercase tracking-widest pb-3 border-b-2 transition-all ${
              filter === val
                ? 'text-primary border-primary'
                : 'text-primary/40 border-transparent hover:text-primary/70'
            }`}
          >
            {label} <span className="opacity-50">({counts[val]})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="group space-y-2">
              {/* Image Thumbnail */}
              <div className="relative aspect-[4/5] bg-surface-variant rounded-sm overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-primary/40 bg-primary/5">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/></svg>
                    <span className="text-[10px] uppercase tracking-widest">Modelo 3D</span>
                  </div>
                )}
                
                {/* Badges for multiple media */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {item.images?.length > 1 && (
                    <div className="bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                      {item.images.length} Fotos
                    </div>
                  )}
                  {item.model_url && (
                    <div className="bg-primary/80 text-white text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                      3D
                    </div>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 gap-2">
                  <button
                    onClick={() => updateItemField(item.id, 'published', !item.published)}
                    className={`flex-1 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-colors ${
                      item.published ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white text-primary hover:bg-white/90'
                    }`}
                  >
                    {item.published ? 'Ocultar' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="px-2 py-1.5 bg-red-500/80 text-white rounded-sm text-[9px] font-bold hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
                {!item.published && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[9px] uppercase tracking-widest rounded-sm">
                    Borrador
                  </div>
                )}
              </div>

              {/* Inline title */}
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) =>
                  setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, title: e.target.value } : i)))
                }
                onBlur={(e) => updateItemField(item.id, 'title', e.target.value)}
                className="w-full text-xs bg-transparent border-b border-transparent hover:border-primary/20 focus:border-primary/40 focus:outline-none py-0.5 transition-colors"
                placeholder="Sin título"
              />

              {/* Inline category */}
              <select
                value={item.category_id || ''}
                onChange={(e) => updateItemField(item.id, 'category_id', e.target.value || null)}
                className="w-full text-[10px] bg-transparent border-b border-transparent hover:border-primary/20 focus:border-primary/40 focus:outline-none py-0.5 transition-colors text-on-surface-variant uppercase tracking-wider cursor-pointer"
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-40">
          <p className="text-on-surface-variant font-light italic mb-6">No hay publicaciones en la galería.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="text-primary text-[10px] uppercase tracking-widest hover:underline"
          >
            Crear primera publicación
          </button>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminGaleria
