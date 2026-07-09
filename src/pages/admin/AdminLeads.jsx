import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'

const STATUS_CONFIG = {
  nuevo:      { label: 'Nuevo',      color: 'bg-blue-100 text-blue-700 border-blue-200' },
  contactado: { label: 'Contactado', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  en_proceso: { label: 'En proceso', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  cerrado:    { label: 'Cerrado',    color: 'bg-green-100 text-green-700 border-green-200' },
  descartado: { label: 'Descartado', color: 'bg-gray-100 text-gray-400 border-gray-200' },
}

const STATUSES = Object.keys(STATUS_CONFIG)

const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const LeadRow = ({ lead, onStatusChange, isExpanded, onToggleExpand }) => {
  const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.nuevo
  const [updating, setUpdating] = useState(false)

  const handleStatus = async (newStatus) => {
    setUpdating(true)
    await onStatusChange(lead.id, newStatus)
    setUpdating(false)
  }

  return (
    <>
      <tr
        className="border-b border-primary/5 hover:bg-surface/60 cursor-pointer transition-colors"
        onClick={onToggleExpand}
      >
        <td className="px-4 py-3.5">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-on-surface">{lead.name}</span>
            <span className="text-[10px] text-on-surface-variant">{lead.email}</span>
          </div>
        </td>
        <td className="px-4 py-3.5 hidden md:table-cell">
          {lead.phone ? (
            <a href={`tel:${lead.phone}`} className="text-xs text-primary hover:underline" onClick={e => e.stopPropagation()}>
              {lead.phone}
            </a>
          ) : (
            <span className="text-xs text-primary/30">—</span>
          )}
        </td>
        <td className="px-4 py-3.5 hidden lg:table-cell">
          <span className="text-xs text-on-surface-variant capitalize">
            {lead.service ? lead.service.replace(/-/g, ' ') : '—'}
          </span>
        </td>
        <td className="px-4 py-3.5">
          {lead.wants_appointment ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-sm w-fit">
                Visita
              </span>
              {lead.appointment_date && (
                <span className="text-[10px] text-on-surface-variant">{formatDate(lead.appointment_date + 'T12:00:00')}</span>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-primary/30">Consulta</span>
          )}
        </td>
        <td className="px-4 py-3.5 hidden sm:table-cell">
          <span className="text-[10px] text-on-surface-variant">{formatDateTime(lead.created_at)}</span>
        </td>
        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
          <select
            value={lead.status || 'nuevo'}
            onChange={e => handleStatus(e.target.value)}
            disabled={updating}
            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border cursor-pointer appearance-none focus:outline-none ${cfg.color} ${updating ? 'opacity-50' : ''}`}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </td>
      </tr>

      {/* Expanded detail row */}
      {isExpanded && (
        <tr className="bg-surface/40 border-b border-primary/5">
          <td colSpan={6} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">Contacto</p>
                <p className="text-sm">{lead.name}</p>
                <a href={`mailto:${lead.email}`} className="text-xs text-primary hover:underline block">{lead.email}</a>
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="text-xs text-primary hover:underline block">{lead.phone}</a>
                )}
              </div>

              {lead.service && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">Servicio</p>
                  <p className="text-sm capitalize">{lead.service.replace(/-/g, ' ')}</p>
                  {lead.area && <p className="text-xs text-on-surface-variant">{lead.area} m²</p>}
                </div>
              )}

              {lead.wants_appointment && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">Visita solicitada</p>
                  <p className="text-sm">
                    {lead.appointment_date
                      ? formatDate(lead.appointment_date + 'T12:00:00')
                      : 'Sin fecha especificada'}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <a
                      href={`https://wa.me/${(lead.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${lead.name}, confirmamos tu visita para el ${lead.appointment_date ? formatDate(lead.appointment_date + 'T12:00:00') : 'día solicitado'}. Nos pondremos en contacto contigo pronto.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] uppercase tracking-wider font-bold bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/20 px-2.5 py-1.5 rounded-sm hover:bg-[#25D366]/20 transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${lead.email}?subject=Confirmación de visita — Arbora Hogar`}
                      className="text-[9px] uppercase tracking-wider font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-1.5 rounded-sm hover:bg-primary/20 transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      Email
                    </a>
                  </div>
                </div>
              )}

              {lead.message && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">Mensaje</p>
                  <p className="text-sm text-on-surface-variant font-light leading-relaxed max-w-2xl">{lead.message}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

const AdminLeads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  // Inlined directly in the effect (rather than a named function called from
  // it) so the initial load doesn't trip the "setState synchronously in
  // effect" lint rule.
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('contact_entries')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setLeads(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    await supabase.from('contact_entries').update({ status: newStatus }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
  }

  const filtered = filter === 'all'
    ? leads
    : filter === 'appointment'
      ? leads.filter(l => l.wants_appointment)
      : leads.filter(l => (l.status || 'nuevo') === filter)

  const counts = {
    all: leads.length,
    nuevo: leads.filter(l => (l.status || 'nuevo') === 'nuevo').length,
    contactado: leads.filter(l => l.status === 'contactado').length,
    appointment: leads.filter(l => l.wants_appointment).length,
  }

  return (
    <AdminLayout title="Leads">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: counts.all },
          { label: 'Nuevos', value: counts.nuevo },
          { label: 'Contactados', value: counts.contactado },
          { label: 'Visitas', value: counts.appointment },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-primary/10 rounded-sm p-5">
            <p className="text-3xl font-serif">{value}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-6 border-b border-primary/10 mb-6">
        {[
          ['all', 'Todos'],
          ['nuevo', 'Nuevos'],
          ['contactado', 'Contactados'],
          ['en_proceso', 'En proceso'],
          ['appointment', 'Visitas'],
          ['cerrado', 'Cerrados'],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`text-[10px] font-bold uppercase tracking-widest pb-3 border-b-2 transition-all whitespace-nowrap ${
              filter === val
                ? 'text-primary border-primary'
                : 'text-primary/40 border-transparent hover:text-primary/70'
            }`}
          >
            {label}
            {counts[val] !== undefined && counts[val] > 0 && (
              <span className="ml-1 opacity-50">({counts[val]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white border border-primary/10 rounded-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/10 bg-surface/50">
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-primary/60">Cliente</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-primary/60 hidden md:table-cell">Teléfono</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-primary/60 hidden lg:table-cell">Servicio</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-primary/60">Tipo</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-primary/60 hidden sm:table-cell">Recibido</th>
                <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-primary/60">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  onStatusChange={handleStatusChange}
                  isExpanded={expandedId === lead.id}
                  onToggleExpand={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-40">
          <p className="text-on-surface-variant font-light italic">No hay leads en esta categoría.</p>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminLeads
