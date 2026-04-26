import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { sanitizeFileName } from '../../lib/utils'
import { SETTING_DEFAULTS, clearSettingsCache } from '../../hooks/useSiteSettings'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminSitio = () => {
  const [local, setLocal] = useState(SETTING_DEFAULTS)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('site_settings').select('key, value')
      if (data) {
        const fromDB = Object.fromEntries(data.map(({ key, value }) => [key, value]))
        setLocal({ ...SETTING_DEFAULTS, ...fromDB })
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const handleImageFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const cancelImageFile = () => {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }

  // Click on the preview image to set focal point
  const handleFocalClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setLocal((p) => ({ ...p, hero_focal_x: String(x), hero_focal_y: String(y) }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let imageUrl = local.hero_image_url

      if (imageFile) {
        const fileName = `hero-${Date.now()}-${sanitizeFileName(imageFile.name)}`
        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(fileName, imageFile, { upsert: false })
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(fileName)
        imageUrl = urlData.publicUrl
      }

      const merged = { ...local, hero_image_url: imageUrl }
      const rows = Object.entries(merged).map(([key, value]) => ({ key, value: String(value) }))
      const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
      if (error) throw error

      clearSettingsCache()
      setLocal(merged)
      cancelImageFile()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      alert('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const previewSrc = imagePreview || local.hero_image_url
  const fx = Number(local.hero_focal_x)
  const fy = Number(local.hero_focal_y)

  if (loading) {
    return (
      <AdminLayout title="Configuración del sitio">
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Configuración del sitio">
      <div className="max-w-4xl space-y-8">

        {/* Hero image */}
        <section className="bg-white border border-primary/10 rounded-sm p-8 space-y-6">
          <div>
            <h2 className="font-serif text-xl mb-1">Imagen principal (Hero)</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Haz clic en la imagen para marcar el punto focal — la zona que siempre quedará
              centrada sin importar el tamaño de pantalla o la proporción de la foto que subas.
            </p>
          </div>

          {/* Focal point picker */}
          <div
            className="relative aspect-video overflow-hidden rounded-sm cursor-crosshair bg-surface-variant select-none"
            onClick={handleFocalClick}
          >
            <img
              src={previewSrc}
              alt="Hero preview"
              className="w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${fx}% ${fy}%` }}
              draggable={false}
            />

            {/* Crosshair at focal point */}
            <div
              className="absolute pointer-events-none"
              style={{ left: `${fx}%`, top: `${fy}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-9 h-9 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)] relative">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white -translate-y-1/2" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white -translate-x-1/2" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className="text-[9px] text-white/80 bg-black/40 px-2 py-1 rounded-sm uppercase tracking-widest">
                Click para ajustar foco
              </span>
            </div>
          </div>

          {/* Fine-tune sliders */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-primary/60 mb-2 block">
                Foco horizontal — {fx}%
              </label>
              <input
                type="range" min="0" max="100"
                value={fx}
                onChange={(e) => setLocal((p) => ({ ...p, hero_focal_x: e.target.value }))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[8px] text-primary/30 mt-1">
                <span>Izquierda</span><span>Centro</span><span>Derecha</span>
              </div>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-primary/60 mb-2 block">
                Foco vertical — {fy}%
              </label>
              <input
                type="range" min="0" max="100"
                value={fy}
                onChange={(e) => setLocal((p) => ({ ...p, hero_focal_y: e.target.value }))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[8px] text-primary/30 mt-1">
                <span>Arriba</span><span>Centro</span><span>Abajo</span>
              </div>
            </div>
          </div>

          {/* Upload button */}
          <div className="flex items-center gap-4 pt-2">
            <label className="px-6 py-2.5 border border-primary/20 rounded-sm text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-surface transition-colors">
              {imageFile ? `✓  ${imageFile.name}` : 'Subir nueva imagen'}
              <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
            </label>
            {imageFile ? (
              <button type="button" onClick={cancelImageFile} className="text-xs text-on-surface-variant hover:text-on-surface">
                Cancelar
              </button>
            ) : (
              <p className="text-[10px] text-on-surface-variant">
                JPG · PNG · WebP · Recomendado: 2400 × 1600 px o mayor
              </p>
            )}
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-12 py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            )}
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
          {saved && (
            <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest">
              ✓ Guardado correctamente
            </span>
          )}
        </div>

        {/* Help note */}
        <p className="text-[10px] text-on-surface-variant leading-relaxed max-w-xl">
          Los cambios se reflejan en la web inmediatamente. Si ves la imagen anterior en el navegador,
          recarga la página (Ctrl+R / Cmd+R).
        </p>
      </div>
    </AdminLayout>
  )
}

export default AdminSitio
