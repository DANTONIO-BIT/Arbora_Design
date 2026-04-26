import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const NOTIFY_EMAIL = Deno.env.get('RESEND_NOTIFY_EMAIL') ?? 'hola@arborahogar.com'
const FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') ?? 'Arbora Hogar <noreply@arborahogar.com>'

interface ContactEntry {
  id: string
  name: string
  email: string
  phone?: string
  service?: string
  area?: number
  message?: string
  wants_appointment: boolean
  appointment_date?: string
  created_at: string
}

interface WebhookPayload {
  type: 'INSERT'
  table: string
  record: ContactEntry
}

const SERVICE_LABELS: Record<string, string> = {
  interiorismo: 'Interiorismo',
  'diseno-cocinas': 'Diseño de cocinas',
  'reformas-hogar': 'Reformas de hogar',
  'proyectos-personalizados': 'Proyectos personalizados',
  'consultoria-estilo': 'Consultoría de estilo',
  'modelados-espacios': 'Modelados de espacios',
}

const formatDate = (iso?: string) => {
  if (!iso) return '—'
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ── Email to Arbora team ────────────────────────────────────────────────────
const buildNotificationEmail = (lead: ContactEntry) => ({
  from: FROM_EMAIL,
  to: [NOTIFY_EMAIL],
  subject: `Nuevo lead${lead.wants_appointment ? ' (solicita visita)' : ''} — ${lead.name}`,
  html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #fcfae9; margin: 0; padding: 0; color: #1c1c12; }
    .wrap { max-width: 600px; margin: 40px auto; background: #fff; border-top: 3px solid #6d5b4f; }
    .header { padding: 32px 40px 24px; border-bottom: 1px solid #ebe9d8; }
    .logo { font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: #6d5b4f; }
    h1 { margin: 8px 0 0; font-size: 22px; font-weight: 400; }
    .body { padding: 32px 40px; }
    .badge { display: inline-block; background: #ebd3c4; color: #6c5a4e; font-size: 11px;
             letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px; margin-bottom: 24px; }
    .badge-appt { background: #6d5b4f; color: #fff; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 0; border-bottom: 1px solid #f0eede; font-size: 15px; vertical-align: top; }
    td:first-child { width: 40%; color: #4e453f; font-size: 11px; letter-spacing: 0.15em;
                     text-transform: uppercase; padding-right: 16px; }
    .message-box { margin-top: 24px; background: #f6f4e3; padding: 16px 20px; font-size: 15px;
                   line-height: 1.7; white-space: pre-wrap; }
    .footer { padding: 20px 40px; background: #f6f4e3; font-size: 11px; color: #4e453f;
              letter-spacing: 0.1em; text-transform: uppercase; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">Arbora Hogar</div>
    <h1>Nueva consulta recibida</h1>
  </div>
  <div class="body">
    ${lead.wants_appointment
      ? '<span class="badge badge-appt">&#10003; Solicita visita presencial</span>'
      : '<span class="badge">Consulta general</span>'}
    <table>
      <tr><td>Nombre</td><td><strong>${lead.name}</strong></td></tr>
      <tr><td>Email</td><td><a href="mailto:${lead.email}" style="color:#6d5b4f">${lead.email}</a></td></tr>
      ${lead.phone ? `<tr><td>Teléfono</td><td>${lead.phone}</td></tr>` : ''}
      ${lead.service ? `<tr><td>Servicio</td><td>${SERVICE_LABELS[lead.service] ?? lead.service}</td></tr>` : ''}
      ${lead.area ? `<tr><td>Superficie</td><td>${lead.area} m²</td></tr>` : ''}
      ${lead.wants_appointment && lead.appointment_date
        ? `<tr><td>Fecha solicitada</td><td><strong>${formatDate(lead.appointment_date)}</strong></td></tr>`
        : ''}
      <tr><td>Recibido</td><td>${new Date(lead.created_at).toLocaleString('es-CL')}</td></tr>
    </table>
    ${lead.message
      ? `<div class="message-box">${lead.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`
      : ''}
  </div>
  <div class="footer">Arbora Hogar · Santiago, Chile · arborahogar.com</div>
</div>
</body>
</html>
  `.trim(),
})

// ── Confirmation email to the user ──────────────────────────────────────────
const buildConfirmationEmail = (lead: ContactEntry) => ({
  from: FROM_EMAIL,
  to: [lead.email],
  subject: lead.wants_appointment
    ? 'Solicitud de visita recibida — Arbora Hogar'
    : 'Recibimos tu consulta — Arbora Hogar',
  html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #fcfae9; margin: 0; padding: 0; color: #1c1c12; }
    .wrap { max-width: 560px; margin: 40px auto; background: #fff; border-top: 3px solid #6d5b4f; }
    .header { padding: 40px 40px 32px; text-align: center; }
    .logo { font-size: 13px; letter-spacing: 0.25em; text-transform: uppercase; color: #6d5b4f; }
    h1 { margin: 16px 0 0; font-size: 26px; font-weight: 400; line-height: 1.3; }
    .body { padding: 0 40px 40px; font-size: 16px; line-height: 1.8; color: #4e453f; }
    .highlight { background: #f6f4e3; padding: 16px 20px; margin: 24px 0; font-size: 14px; }
    .cta { display: block; margin: 32px 0 0; text-align: center; }
    .cta a { background: #ebd3c4; color: #6c5a4e; text-decoration: none; padding: 14px 32px;
              font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; }
    .footer { padding: 20px 40px; background: #f6f4e3; font-size: 11px; color: #4e453f;
              letter-spacing: 0.1em; text-align: center; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">Arbora Hogar</div>
    <h1>${lead.wants_appointment ? 'Tu visita está en camino.' : 'Mensaje recibido.'}</h1>
  </div>
  <div class="body">
    <p>Hola ${lead.name.split(' ')[0]},</p>
    ${lead.wants_appointment
      ? `<p>Recibimos tu solicitud de visita${lead.appointment_date ? ` para el <strong>${formatDate(lead.appointment_date)}</strong>` : ''}. Confirmaremos disponibilidad y te escribiremos dentro de las próximas 24 horas.</p>`
      : '<p>Recibimos tu consulta y ya está en manos de nuestro equipo. Te responderemos en menos de 24 horas hábiles.</p>'}
    <div class="highlight">
      <strong>¿Tienes dudas urgentes?</strong><br>
      Escríbenos directamente a <a href="mailto:${NOTIFY_EMAIL}" style="color:#6d5b4f">${NOTIFY_EMAIL}</a>
    </div>
    <div class="cta"><a href="https://arborahogar.com/proyectos">Ver nuestros proyectos</a></div>
  </div>
  <div class="footer">Arbora Hogar · Santiago, Chile · arborahogar.com</div>
</div>
</body>
</html>
  `.trim(),
})

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend error ${res.status}: ${text}`)
  }
  return res.json()
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload: WebhookPayload = await req.json()

    if (payload.type !== 'INSERT' || payload.table !== 'contact_entries') {
      return new Response('Ignored', { status: 200 })
    }

    const lead = payload.record

    await Promise.all([
      sendEmail(buildNotificationEmail(lead)),
      sendEmail(buildConfirmationEmail(lead)),
    ])

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('notify-new-lead error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
