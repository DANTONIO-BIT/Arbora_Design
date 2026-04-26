import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'

const slugify = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')

const AdminCategorias = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', color: '#8B6F5C', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'name' && !editing) next.slug = slugify(value)
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      color: form.color,
      description: form.description,
    }

    if (editing) {
      await supabase.from('categories').update(payload).eq('id', editing)
    } else {
      await supabase.from('categories').insert(payload)
    }

    setForm({ name: '', slug: '', color: '#8B6F5C', description: '' })
    setEditing(null)
    setSaving(false)
    fetchCategories()
  }

  const handleEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, color: cat.color || '#8B6F5C', description: cat.description || '' })
    setEditing(cat.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditing(null)
    setForm({ name: '', slug: '', color: '#8B6F5C', description: '' })
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar categoría? Los proyectos y galerías que la usen quedarán sin categoría.')) return
    await supabase.from('categories').delete().eq('id', id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <AdminLayout title="Categorías">
      <div className="max-w-2xl space-y-8">

        {/* Form */}
        <div className="bg-white border border-primary/10 rounded-sm p-6 space-y-5">
          <h2 className="font-serif text-lg">
            {editing ? 'Editar categoría' : 'Nueva categoría'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-surface-variant/20 border border-primary/10 rounded-sm text-sm focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="auto-generado"
                  className="w-full px-3 py-2.5 bg-surface-variant/20 border border-primary/10 rounded-sm text-sm focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-10 h-10 border border-primary/10 rounded-sm cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2.5 bg-surface-variant/20 border border-primary/10 rounded-sm text-sm focus:outline-none focus:border-primary/40"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1.5">
                  Descripción
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-surface-variant/20 border border-primary/10 rounded-sm text-sm focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-on-primary px-8 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-[10px] text-on-surface-variant hover:text-on-surface uppercase tracking-widest px-4"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-white border border-primary/10 rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-primary/10">
            <h2 className="font-serif">Categorías existentes</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Cargando...</div>
          ) : categories.length > 0 ? (
            <div className="divide-y divide-primary/5">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface/50 transition-colors">
                  <span
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{cat.name}</p>
                    {cat.description && (
                      <p className="text-[10px] text-on-surface-variant truncate">{cat.description}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant/40 font-mono">{cat.slug}</span>
                  <div className="flex gap-4 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-[10px] text-primary uppercase tracking-widest hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-[10px] text-red-500 uppercase tracking-widest hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-on-surface-variant">
              No hay categorías. Crea una arriba.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminCategorias
