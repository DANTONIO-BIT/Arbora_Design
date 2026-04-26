import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { sanitizeFileName } from '../../lib/utils'
import AdminLayout from '../../components/admin/AdminLayout'

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

const AdminProyecto = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  
  const [loading, setLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    location: '',
    area: '',
    concept: '',
    description: '',
    story: '',
    featured: false,
    published: true,
    has_model: false,
  })

  const [images, setImages] = useState([]) // Array of existing image URLs
  const [newImageFiles, setNewImageFiles] = useState([]) // Files to upload
  const [modelFile, setModelFile] = useState(null)
  const [modelUrl, setModelUrl] = useState('')

  useEffect(() => {
    const init = async () => {
      // 1. Fetch categories
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (cats) {
        setCategories(cats)
        if (isNew && cats.length > 0) {
          setFormData(prev => ({ ...prev, category_id: cats[0].id }))
        }
      }

      // 2. Fetch project if editing
      if (!isNew) {
        const { data: project, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error fetching project:', error)
          navigate('/admin/proyectos')
          return
        }

        if (project) {
          setFormData({
            title: project.title || '',
            slug: project.slug || '',
            category_id: project.category_id || '',
            location: project.location || '',
            area: project.area || '',
            concept: project.concept || '',
            description: project.description || '',
            story: project.story || '',
            featured: project.featured || false,
            published: project.published || false,
            has_model: project.has_model || false,
          })
          setImages(project.images || [])
          setModelUrl(project.model_url || '')
        }
        setLoading(false)
      }
    }

    init()
  }, [id, isNew, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    
    setFormData(prev => {
      const newData = { ...prev, [name]: val }
      // Auto-generate slug if title changes and it's a new project
      if (name === 'title' && (isNew || !prev.slug)) {
        newData.slug = slugify(value)
      }
      return newData
    })
  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      setNewImageFiles(prev => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleModelChange = (e) => {
    if (e.target.files?.[0]) {
      setModelFile(e.target.files[0])
      setFormData(prev => ({ ...prev, has_model: true }))
    }
  }

  const uploadFiles = async () => {
    const uploadedImageUrls = [...images]

    for (const file of newImageFiles) {
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, { upsert: false })

      if (uploadError) {
        throw new Error(`Storage error (project-images): ${uploadError.message}`)
      }

      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName)

      uploadedImageUrls.push(urlData.publicUrl)
    }

    let finalModelUrl = modelUrl
    if (modelFile) {
      const fileName = `${Date.now()}-${sanitizeFileName(modelFile.name)}`

      const { error: uploadError } = await supabase.storage
        .from('project-models')
        .upload(fileName, modelFile, { upsert: false })

      if (uploadError) {
        throw new Error(`Storage error (project-models): ${uploadError.message}`)
      }

      const { data: urlData } = supabase.storage
        .from('project-models')
        .getPublicUrl(fileName)

      finalModelUrl = urlData.publicUrl
    }

    return { images: uploadedImageUrls, model_url: finalModelUrl }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { images: finalImages, model_url: finalModelUrl } = await uploadFiles()

      const payload = {
        ...formData,
        images: finalImages,
        model_url: finalModelUrl,
        area: formData.area ? parseInt(formData.area) : null
      }

      let error
      if (isNew) {
        const { error: err } = await supabase.from('projects').insert(payload)
        error = err
      } else {
        const { error: err } = await supabase.from('projects').update(payload).eq('id', id)
        error = err
      }

      if (error) throw error

      navigate('/admin/proyectos')
    } catch (err) {
      console.error('Error saving project:', err)
      alert('Error al guardar el proyecto: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return (
    <AdminLayout title="Proyectos">
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    </AdminLayout>
  )

  const pageTitle = isNew ? 'Nuevo proyecto' : (formData.title || 'Editar proyecto')

  return (
    <AdminLayout title={pageTitle}>
      <div className="max-w-3xl">
        <Link
          to="/admin/proyectos"
          className="text-[10px] text-on-surface-variant hover:text-on-surface uppercase tracking-widest mb-6 inline-block"
        >
          ← Volver a proyectos
        </Link>

        <form onSubmit={handleSubmit} className="bg-white rounded-sm p-8 space-y-8 border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Título *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface-variant/20 border border-primary/10 rounded-sm 
                         focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Slug (URL)</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface-variant/20 border border-primary/10 rounded-sm 
                         focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Categoría</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface-variant/20 border border-primary/10 rounded-sm 
                         focus:outline-none focus:border-primary/40 transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Ubicación</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface-variant/20 border border-primary/10 rounded-sm 
                         focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Área (m²)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface-variant/20 border border-primary/10 rounded-sm 
                         focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Concepto editorial</label>
            <p className="text-[10px] text-on-surface-variant mb-2">
              Frase corta que define la esencia del proyecto. Aparece como titular en la página de detalle.
            </p>
            <input
              type="text"
              name="concept"
              value={formData.concept}
              onChange={handleChange}
              placeholder="Una búsqueda de equilibrio y luz"
              className="w-full px-4 py-3 bg-surface-variant/20 border border-primary/10 rounded-sm
                       focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Descripción corta</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-variant/20 border border-primary/10 rounded-sm
                       focus:outline-none focus:border-primary/40 resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Story (Descripción larga)</label>
            <textarea
              name="story"
              rows={8}
              value={formData.story}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-variant/20 border border-primary/10 rounded-sm 
                       focus:outline-none focus:border-primary/40 resize-none transition-colors"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Imágenes del Proyecto</label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Existing Images */}
              {images.map((url, i) => (
                <div key={`exist-${i}`} className="relative aspect-square rounded-sm overflow-hidden border border-primary/10 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {/* New Image Previews */}
              {newImageFiles.map((file, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-sm overflow-hidden border border-primary/20 bg-primary/5 group">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover opacity-70" />
                  <button 
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[8px] uppercase tracking-tighter bg-primary/80 text-white px-2 py-0.5 rounded-sm">Sin Guardar</span>
                  </div>
                </div>
              ))}

              {/* Upload Button */}
              <label className="aspect-square border-2 border-dashed border-primary/10 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-colors">
                <span className="text-2xl font-light text-primary/30">+</span>
                <span className="text-[10px] uppercase tracking-widest text-primary/40 mt-2">Añadir</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Model Upload */}
          <div className="p-6 bg-surface-variant/10 border border-primary/5 rounded-sm">
            <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-4">Modelo 3D (.glb)</label>
            <div className="flex items-center gap-4">
              <label className="px-6 py-2 border border-primary/20 rounded-sm text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-primary/5">
                {modelFile ? 'Cambiar archivo' : 'Subir .glb'}
                <input type="file" accept=".glb" onChange={handleModelChange} className="hidden" />
              </label>
              {modelFile && <span className="text-xs text-on-surface-variant">{modelFile.name}</span>}
              {!modelFile && modelUrl && <span className="text-xs text-on-surface-variant">Modelo actual vinculado</span>}
            </div>
            {modelUrl && (
               <div className="mt-4 flex items-center gap-2">
                 <input 
                  type="checkbox" 
                  name="has_model" 
                  checked={formData.has_model} 
                  onChange={handleChange}
                  className="rounded border-primary/20 text-primary focus:ring-primary/40"
                 />
                 <span className="text-xs text-on-surface-variant">Habilitar visualización 3D en el detalle</span>
               </div>
            )}
          </div>

          <div className="flex flex-wrap gap-8 py-4 border-t border-primary/5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/40"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Publicar en la web</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/40"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Destacado (Home)</span>
            </label>
          </div>

          <div className="flex gap-4 pt-8">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary text-white px-12 py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-[10px]
                       hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              {isSaving ? 'Subiendo archivos y guardando...' : 'Guardar Proyecto y Subir Archivos'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/proyectos')}
              className="px-8 py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-[10px] text-on-surface-variant 
                       hover:text-on-surface"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AdminProyecto