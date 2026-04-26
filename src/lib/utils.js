// Generates a URL-friendly slug from a string
export const slugify = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

// Sanitizes a filename for safe Supabase Storage upload.
// Removes accents, replaces spaces and special chars with hyphens,
// preserves the file extension.
export const sanitizeFileName = (name) => {
  const lastDot = name.lastIndexOf('.')
  const ext = lastDot > 0 ? name.slice(lastDot).toLowerCase() : ''
  const base = lastDot > 0 ? name.slice(0, lastDot) : name
  const clean = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${clean}${ext}`
}

// Format a number for display (e.g. 1200 → "1.200")
export const formatNumber = (n) =>
  new Intl.NumberFormat('es-CL').format(n)

// Check if user prefers reduced motion
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Build WhatsApp URL with contextual message
export const buildWhatsAppUrl = (message) => {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || ''
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${number}?text=${encoded}`
}
