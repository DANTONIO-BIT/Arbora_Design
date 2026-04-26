import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'

// Returns the ISO string for the first second of the current month
const startOfMonth = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
}

// Returns an array of the last N days as 'DD MMM' labels
const lastNDays = (n) => {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      label: d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }),
      date: d.toISOString().split('T')[0],
    })
  }
  return days
}

const AdminDashboard = () => {
  const [projects,       setProjects]       = useState([])
  const [galleryCount,   setGalleryCount]   = useState(0)
  const [leadsCount,     setLeadsCount]     = useState(0)
  const [viewsMonth,     setViewsMonth]     = useState(0)
  const [convRatio,      setConvRatio]      = useState(0)
  const [topProject,     setTopProject]     = useState(null)
  const [dailyViews,     setDailyViews]     = useState([])
  const [recentLeads,    setRecentLeads]    = useState([])
  const [loading,        setLoading]        = useState(true)
  const [search,         setSearch]         = useState('')
  const [filter,         setFilter]         = useState('all')
  const [deleting,       setDeleting]       = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    const monthStart = startOfMonth()

    const [
      { data: projs },
      { count: galCount },
      { count: leadsNew },
      { data: views },
      { data: leadsRecent },
    ] = await Promise.all([
      supabase.from('projects').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('contact_entries').select('*', { count: 'exact', head: true }).eq('status', 'nuevo'),
      supabase.from('page_views').select('path, project_slug, created_at').gte('created_at', monthStart),
      supabase.from('contact_entries').select('id, name, service, status, created_at').order('created_at', { ascending: false }).limit(3),
    ])

    if (projs) setProjects(projs)
    setGalleryCount(galCount || 0)
    setLeadsCount(leadsNew || 0)
    if (recentLeads) setRecentLeads(leadsRecent)

    // Analytics
    if (views) {
      setViewsMonth(views.length)

      // Most visited project
      const slugCounts = {}
      views.forEach(({ project_slug }) => {
        if (project_slug) slugCounts[project_slug] = (slugCounts[project_slug] || 0) + 1
      })
      const sorted = Object.entries(slugCounts).sort((a, b) => b[1] - a[1])
      setTopProject(sorted[0] || null)

      // Daily chart (last 7 days)
      const days = lastNDays(7)
      const dayMap = {}
      views.forEach(({ created_at }) => {
        const day = created_at.split('T')[0]
        dayMap[day] = (dayMap[day] || 0) + 1
      })
      setDailyViews(days.map((d) => ({ ...d, count: dayMap[d.date] || 0 })))

      // Conversion ratio this month
      const leadsThisMonth = await supabase
        .from('contact_entries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart)
      const ratio = views.length > 0 ? ((leadsThisMonth.count || 0) / views.length) * 100 : 0
      setConvRatio(Math.round(ratio * 10) / 10)
    }

    setLoading(false)
  }

  const togglePublished = async (e, id, current) => {
    e.preventDefault(); e.stopPropagation()
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, published: !current } : p)))
    await supabase.from('projects').update({ published: !current }).eq('id', id)
  }

  const deleteProject = async (e, id) => {
    e.preventDefault(); e.stopPropagation()
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return
    setDeleting(id)
    await supabase.from('projects').delete().eq('id', id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setDeleting(null)
  }

  const filtered = projects.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'published' && p.published) ||
      (filter === 'draft' && !p.published) ||
      (filter === 'featured' && p.featured)
    return matchSearch && matchFilter
  })

  const counts = {
    all:       projects.length,
    published: projects.filter((p) => p.published).length,
    draft:     projects.filter((p) => !p.published).length,
    featured:  projects.filter((p) => p.featured).length,
  }

  const maxViews = Math.max(...dailyViews.map((d) => d.count), 1)

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  const actions = (
    <Link
      to="/admin/proyectos/new"
      className="bg-primary text-on-primary px-5 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
    >
      + Nuevo proyecto
    </Link>
  )

  return (
    <AdminLayout title="Proyectos" actions={actions}>

      {/* ─── Stat cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total',          value: counts.all },
          { label: 'Publicados',     value: counts.published },
          { label: 'Borradores',     value: counts.draft },
          { label: 'Galería',        value: galleryCount,  to: '/admin/galeria' },
          { label: 'Leads nuevos',   value: leadsCount,    to: '/admin/leads' },
        ].map(({ label, value, to }) => {
          const W = to ? Link : 'div'
          return (
            <W key={label} to={to} className={`bg-white border border-primary/10 rounded-sm p-5 ${to ? 'hover:border-primary/30 transition-colors' : ''}`}>
              <p className="text-3xl font-serif">{value}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{label}</p>
            </W>
          )
        })}
      </div>

      {/* ─── Analytics row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* Visitas del mes + ratio */}
        <div className="bg-white border border-primary/10 rounded-sm p-6 space-y-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60">Este mes</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-serif">{viewsMonth}</p>
              <p className="text-[10px] text-on-surface-variant mt-1">Visitas totales</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-serif text-primary">{convRatio}%</p>
              <p className="text-[10px] text-on-surface-variant mt-1">Conversión</p>
            </div>
          </div>
          {topProject && (
            <div className="pt-4 border-t border-primary/5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary/40 mb-1">Proyecto más visto</p>
              <p className="text-xs font-medium text-on-surface truncate">{topProject[0]}</p>
              <p className="text-[10px] text-on-surface-variant">{topProject[1]} visitas</p>
            </div>
          )}
        </div>

        {/* Bar chart — últimos 7 días */}
        <div className="bg-white border border-primary/10 rounded-sm p-6 col-span-1 md:col-span-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 mb-5">Visitas — últimos 7 días</p>
          {dailyViews.length > 0 ? (
            <div className="flex items-end justify-between gap-2 h-24">
              {dailyViews.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full bg-primary/15 rounded-sm relative overflow-hidden transition-all duration-500"
                    style={{ height: '100%' }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-primary rounded-sm transition-all duration-700"
                      style={{ height: `${(d.count / maxViews) * 100}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-on-surface-variant whitespace-nowrap">{d.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-24 flex items-center justify-center">
              <p className="text-[10px] text-on-surface-variant italic">Sin datos todavía</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Últimas consultas ─── */}
      {recentLeads.length > 0 && (
        <div className="bg-white border border-primary/10 rounded-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60">Últimas consultas</p>
            <Link to="/admin/leads" className="text-[9px] uppercase tracking-widest text-primary hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-primary/5">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">{lead.name}</p>
                  <p className="text-[10px] text-on-surface-variant capitalize">{lead.service?.replace(/-/g, ' ') || '—'}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[9px] text-on-surface-variant">{formatDate(lead.created_at)}</span>
                  <Link
                    to="/admin/leads"
                    className="text-[9px] font-bold uppercase tracking-widest text-primary border border-primary/20 px-3 py-1.5 rounded-sm hover:bg-primary/5 transition-colors"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Filters + search ─── */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex gap-6 border-b border-primary/10 flex-1">
          {[['all', 'Todos'], ['published', 'Publicados'], ['draft', 'Borradores'], ['featured', 'Destacados']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`text-[10px] font-bold uppercase tracking-widest pb-3 border-b-2 transition-all ${
                filter === val ? 'text-primary border-primary' : 'text-primary/40 border-transparent hover:text-primary/70'
              }`}
            >
              {label} <span className="opacity-50">({counts[val]})</span>
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-white border border-primary/10 rounded-sm text-xs w-full md:w-48 focus:outline-none focus:border-primary/40"
        />
      </div>

      {/* ─── Projects grid ─── */}
      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((project) => (
            <Link
              key={project.id}
              to={`/admin/proyectos/${project.id}`}
              className={`group bg-white border border-primary/10 rounded-sm overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300 ${
                deleting === project.id ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              <div className="aspect-[16/10] bg-surface-variant overflow-hidden relative">
                {project.images?.[0] ? (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[10px] text-primary/20 uppercase tracking-widest">Sin imagen</span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold rounded-sm ${
                    project.published ? 'bg-green-100 text-green-700' : 'bg-black/40 text-white'
                  }`}>
                    {project.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                {project.featured && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] px-2 py-0.5 bg-primary/80 text-white uppercase tracking-wider font-bold rounded-sm">
                      Destacado
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => togglePublished(e, project.id, project.published)}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-[9px] font-bold uppercase tracking-wider rounded-sm transition-colors"
                  >
                    {project.published ? 'Ocultar' : 'Publicar'}
                  </button>
                  <button
                    onClick={(e) => deleteProject(e, project.id)}
                    className="px-3 py-1.5 bg-red-500/70 hover:bg-red-500/90 text-white text-[9px] font-bold uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-serif text-base leading-tight line-clamp-1">{project.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-primary/60 uppercase tracking-wider">
                    {project.categories?.name || '—'}
                  </span>
                  {project.area && (
                    <span className="text-[10px] text-on-surface-variant">{project.area}m²</span>
                  )}
                </div>
                <button
                  onClick={(e) => togglePublished(e, project.id, project.published)}
                  className={`w-full mt-1 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-wider transition-colors border ${
                    project.published
                      ? 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'
                      : 'border-primary/20 text-primary/50 bg-surface hover:bg-primary/5'
                  }`}
                >
                  {project.published ? '● Publicado — click para ocultar' : '○ Borrador — click para publicar'}
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-40">
          <p className="text-on-surface-variant font-light italic mb-6">
            {search ? `Sin resultados para "${search}"` : 'No hay proyectos aún.'}
          </p>
          <Link to="/admin/proyectos/new" className="text-primary text-[10px] uppercase tracking-widest hover:underline">
            Crear primer proyecto
          </Link>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminDashboard
