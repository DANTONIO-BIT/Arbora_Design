import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Silently tracks page visits. Fire-and-forget — never blocks the UI.
export const usePageView = () => {
  const location = useLocation()

  useEffect(() => {
    const projectSlug = location.pathname.startsWith('/proyectos/')
      ? location.pathname.replace('/proyectos/', '')
      : null

    supabase
      .from('page_views')
      .insert({ path: location.pathname, project_slug: projectSlug })
      .then()
  }, [location.pathname])
}
