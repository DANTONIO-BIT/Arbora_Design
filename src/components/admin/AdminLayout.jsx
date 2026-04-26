import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const NAV = [
  {
    path: '/admin/proyectos',
    label: 'Proyectos',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M4 6h16M4 10h16M4 14h8M4 18h8" />
      </svg>
    ),
  },
  {
    path: '/admin/galeria',
    label: 'Galería',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    path: '/admin/categorias',
    label: 'Categorías',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    path: '/admin/leads',
    label: 'Leads',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  {
    path: '/admin/sitio',
    label: 'Sitio',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

const BUCKETS = ['project-images', 'project-models', 'gallery-images', 'site-assets']

const StorageStatus = () => {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const check = async () => {
      const results = {}
      for (const bucket of BUCKETS) {
        const { error } = await supabase.storage.from(bucket).list('', { limit: 1 })
        results[bucket] = !error
      }
      setStatus(results)
    }
    check()
  }, [])

  if (!status) return null

  const allOk = Object.values(status).every(Boolean)
  if (allOk) return null

  return (
    <div className="bg-red-50 border-b border-red-200 px-8 py-3">
      <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">
        ⚠ Problema con Storage — las imágenes no se cargarán
      </p>
      <div className="flex gap-4">
        {BUCKETS.map((b) => (
          <span key={b} className={`text-[10px] font-mono ${status[b] ? 'text-green-600' : 'text-red-600 font-bold'}`}>
            {status[b] ? '✓' : '✗'} {b}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-red-600 mt-1">
        Ve a Supabase Dashboard → Storage → crea los buckets marcados con ✗ como <strong>públicos</strong>.
      </p>
    </div>
  )
}

const AdminLayout = ({ children, title, actions }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [newLeads, setNewLeads] = useState(0)

  // Initial count + realtime subscription for new leads
  useEffect(() => {
    supabase
      .from('contact_entries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'nuevo')
      .then(({ count }) => setNewLeads(count || 0))

    const channel = supabase
      .channel('admin-leads-badge')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_entries' },
        () => setNewLeads((n) => n + 1)
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'contact_entries' },
        (payload) => {
          if (payload.old?.status === 'nuevo' && payload.new?.status !== 'nuevo') {
            setNewLeads((n) => Math.max(0, n - 1))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('arbora_admin')
    navigate('/admin')
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-primary/10 flex flex-col flex-shrink-0 sticky top-0 h-screen">
        {/* Brand */}
        <div className="px-6 py-7 border-b border-primary/10">
          <span className="font-serif text-xl text-on-surface">Arbora</span>
          <span className="text-[9px] text-primary/40 uppercase tracking-[0.25em] block mt-0.5">
            Panel de control
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ path, label, icon }) => {
            const active = pathname === path || pathname.startsWith(path + '/')
            const isLeads = path === '/admin/leads'
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${
                  active
                    ? 'bg-primary/8 text-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface'
                }`}
              >
                <span className={active ? 'text-primary' : 'text-primary/30'}>{icon}</span>
                {label}
                {isLeads && newLeads > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[8px] font-bold rounded-full min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-1 leading-none">
                    {newLeads > 9 ? '9+' : newLeads}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary/10 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-[9px] text-on-surface-variant hover:text-on-surface uppercase tracking-widest transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver sitio
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[9px] text-on-surface-variant hover:text-on-surface uppercase tracking-widest transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <StorageStatus />
        {/* Top bar */}
        {(title || actions) && (
          <header className="bg-white border-b border-primary/10 px-8 py-5 flex items-center justify-between flex-shrink-0">
            <h1 className="font-serif text-2xl">{title}</h1>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </header>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
