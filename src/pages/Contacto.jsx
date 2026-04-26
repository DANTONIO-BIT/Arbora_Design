import { useState, useRef } from 'react'
import { services } from '../data/services'
import Button from '../components/ui/Button'
import { supabase } from '../lib/supabase'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Contacto = () => {
  const containerRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    area: '',
    message: '',
    wants_appointment: false,
    appointment_date: '',
    gdpr: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useGSAP(() => {
    gsap.fromTo(
      '.reveal',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', clearProps: 'all' }
    )
  }, { scope: containerRef })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.gdpr) return
    setIsSubmitting(true)
    setSubmitError(null)

    const { error } = await supabase.from('contact_entries').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      service: formData.service || null,
      area: formData.area ? parseInt(formData.area) : null,
      message: formData.message,
      wants_appointment: formData.wants_appointment,
      appointment_date: formData.wants_appointment && formData.appointment_date
        ? formData.appointment_date
        : null,
      status: 'nuevo',
      source: 'web',
    })

    if (error) {
      setSubmitError('Hubo un problema al enviar. Inténtalo de nuevo o escríbenos directamente.')
      setIsSubmitting(false)
      return
    }

    setSubmitted(true)
    setIsSubmitting(false)
  }

  // ── Success screen ──────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-white">
        <div className="max-w-md text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center mx-auto">
            <svg className="w-9 h-9 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 className="text-4xl font-serif">Mensaje Recibido</h1>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed">
            {formData.wants_appointment
              ? 'Hemos registrado tu solicitud de visita. Te confirmaremos la cita dentro de las próximas 24 horas.'
              : 'Nuestro equipo revisará tu consulta y te responderá en menos de 24 horas.'}
          </p>
          {formData.wants_appointment && formData.appointment_date && (
            <p className="text-sm text-primary font-medium caps-widest">
              Fecha solicitada: {new Date(formData.appointment_date + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
          <a href="/" className="inline-block text-primary uppercase tracking-widest text-xs font-bold border-b border-primary pb-1">
            Volver al inicio
          </a>
        </div>
      </main>
    )
  }

  // ── Min appointment date: tomorrow ──────────────────────
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <main ref={containerRef} className="bg-white">
      <section className="section-padding pt-40">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">

            {/* ── Left col ── */}
            <div className="lg:col-span-5 space-y-14">
              <div className="reveal">
                <span className="caps-widest text-primary mb-6 block">Contacto</span>
                <h1 className="font-serif">Hablemos de tu <br /><span className="italic">próximo espacio.</span></h1>
                <p className="text-on-surface-variant mt-6 text-xl font-light leading-relaxed">
                  Cada gran proyecto comienza con una conversación honesta.
                  Cuéntanos qué imaginas y nosotros lo haremos realidad.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-10 reveal">
                {[
                  { label: 'Email', value: import.meta.env.VITE_CONTACT_EMAIL || 'hola@arborahogar.cl' },
                  { label: 'WhatsApp', value: import.meta.env.VITE_WHATSAPP_NUMBER || '+56 9 ···' },
                  { label: 'Estudio', value: 'Santiago, Chile' },
                  { label: 'Horario', value: 'Lunes — Viernes\n09:00 — 18:00' },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{label}</span>
                    <p className="text-base font-light leading-relaxed whitespace-pre-line">{value}</p>
                  </div>
                ))}
              </div>

              {/* Appointment highlight */}
              <div className="reveal p-6 bg-surface-variant/30 rounded-sm border-l-2 border-primary/40">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Visita sin compromiso</p>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                  Agenda una visita a tu espacio. Evaluamos el proyecto in situ y te entregamos una propuesta gratuita.
                </p>
              </div>
            </div>

            {/* ── Form ── */}
            <div className="lg:col-span-7 reveal">
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { id: 'name', label: 'Nombre *', type: 'text', placeholder: 'Tu nombre completo', required: true },
                    { id: 'email', label: 'Email *', type: 'email', placeholder: 'tu@email.com', required: true },
                  ].map(({ id, label, type, placeholder, required }) => (
                    <div key={id} className="space-y-2">
                      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-primary">{label}</label>
                      <input
                        type={type}
                        id={id}
                        name={id}
                        required={required}
                        value={formData[id]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary outline-none transition-colors text-base font-light placeholder:text-primary/25"
                      />
                    </div>
                  ))}
                </div>

                {/* Phone + Service */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-primary">Teléfono</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+56 9 ···"
                      className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary outline-none transition-colors text-base font-light placeholder:text-primary/25"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-[10px] font-bold uppercase tracking-widest text-primary">Servicio de interés</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary outline-none transition-colors text-base font-light appearance-none cursor-pointer"
                    >
                      <option value="">Selecciona</option>
                      {services.map(s => (
                        <option key={s.id} value={s.slug}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Area + Message */}
                <div className="space-y-2">
                  <label htmlFor="area" className="text-[10px] font-bold uppercase tracking-widest text-primary">Superficie aproximada (m²)</label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    min="1"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Ej: 80"
                    className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary outline-none transition-colors text-base font-light placeholder:text-primary/25"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-primary">Cuéntanos tu visión</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe brevemente el espacio, el estilo que imaginas, el presupuesto aproximado..."
                    className="w-full bg-transparent border-b border-primary/20 py-3 focus:border-primary outline-none transition-colors text-base font-light resize-none placeholder:text-primary/25"
                  />
                </div>

                {/* Appointment toggle */}
                <div className="py-4 border-t border-primary/10 space-y-5">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, wants_appointment: !prev.wants_appointment }))}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0 ${
                        formData.wants_appointment ? 'bg-primary' : 'bg-primary/20'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                        formData.wants_appointment ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </div>
                    <input
                      type="checkbox"
                      name="wants_appointment"
                      checked={formData.wants_appointment}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface">Solicitar visita presencial</p>
                      <p className="text-xs text-on-surface-variant font-light mt-0.5">Agendamos una visita a tu espacio sin costo</p>
                    </div>
                  </label>

                  {/* Date picker — visible only when toggle is on */}
                  {formData.wants_appointment && (
                    <div className="pl-14 space-y-2">
                      <label htmlFor="appointment_date" className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Fecha preferida *
                      </label>
                      <input
                        type="date"
                        id="appointment_date"
                        name="appointment_date"
                        min={minDate}
                        required={formData.wants_appointment}
                        value={formData.appointment_date}
                        onChange={handleChange}
                        className="bg-transparent border-b border-primary/30 py-2 focus:border-primary outline-none transition-colors text-base font-light cursor-pointer"
                      />
                      <p className="text-[10px] text-on-surface-variant">
                        Confirmaremos disponibilidad en menos de 24h.
                      </p>
                    </div>
                  )}
                </div>

                {/* GDPR */}
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="gdpr"
                    required
                    checked={formData.gdpr}
                    onChange={handleChange}
                    className="mt-1.5 w-4 h-4 accent-primary flex-shrink-0"
                  />
                  <span className="text-xs text-on-surface-variant font-light leading-relaxed">
                    Acepto la política de privacidad y autorizo el tratamiento de mis datos para recibir una propuesta personalizada.
                  </span>
                </label>

                {/* Error */}
                {submitError && (
                  <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-sm">{submitError}</p>
                )}

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full md:w-auto px-16"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Enviando...'
                      : formData.wants_appointment
                        ? 'Solicitar visita y consulta'
                        : 'Enviar consulta'}
                  </Button>
                  <p className="text-[10px] text-on-surface-variant mt-3 uppercase tracking-wider">
                    Te respondemos en menos de 24h · Sin compromiso
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contacto
