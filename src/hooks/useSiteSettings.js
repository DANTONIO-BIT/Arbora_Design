import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const CACHE_KEY = 'arbora_site_settings'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export const SETTING_DEFAULTS = {
  hero_image_url: '/hero/hero.png',
  hero_focal_x: '50',
  hero_focal_y: '50',
  manifesto_image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85',
}

const readCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const { data, ts } = JSON.parse(cached)
    if (Date.now() - ts < CACHE_TTL) return data
  } catch {}
  return null
}

export const clearSettingsCache = () => {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState(() => {
    const cached = readCache()
    return cached ? { ...SETTING_DEFAULTS, ...cached } : SETTING_DEFAULTS
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from('site_settings').select('key, value')
      if (data && !error) {
        const fromDB = Object.fromEntries(data.map(({ key, value }) => [key, value]))
        setSettings({ ...SETTING_DEFAULTS, ...fromDB })
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: fromDB, ts: Date.now() }))
        } catch {}
      }
      setLoading(false)
    }
    fetch()
  }, [])

  return { settings, loading }
}
