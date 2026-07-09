import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, Suspense, lazy } from 'react'
import Preloader from './components/ui/Preloader'
import { initLenis, destroyLenis } from './lib/lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Layout from './components/layout/Layout'
import PrivateRoute from './components/ui/PrivateRoute'

// Home stays eagerly loaded — it's the landing page almost every visitor hits.
import Home from './pages/Home'

// Everything else is route-split: a public visitor browsing the marketing
// pages never downloads the admin panel (forms, realtime subscriptions) or
// the Three.js viewer (only needed by Proyectos/Galeria when a 3D model
// is actually opened).
const Proyectos = lazy(() => import('./pages/Proyectos'))
const ProyectoDetalle = lazy(() => import('./pages/ProyectoDetalle'))
const Galeria = lazy(() => import('./pages/Galeria'))
const Servicios = lazy(() => import('./pages/Servicios'))
const About = lazy(() => import('./pages/About'))
const Contacto = lazy(() => import('./pages/Contacto'))

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProyecto = lazy(() => import('./pages/admin/AdminProyecto'))
const AdminGaleria = lazy(() => import('./pages/admin/AdminGaleria'))
const AdminCategorias = lazy(() => import('./pages/admin/AdminCategorias'))
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'))
const AdminSitio = lazy(() => import('./pages/admin/AdminSitio'))

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
)

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const App = () => {
  const [preloaderDone, setPreloaderDone] = useState(false)

  useEffect(() => {
    initLenis()
    return () => destroyLenis()
  }, [])

  // After preloader exits, recalculate all ScrollTrigger positions.
  // Without this, triggers registered during the preloader phase can miss
  // their firing point because the DOM settled after they were created.
  useEffect(() => {
    if (preloaderDone) {
      ScrollTrigger.refresh()
    }
  }, [preloaderDone])

  return (
  <BrowserRouter>
    {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
    <ScrollToTop />
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/proyectos/:slug" element={<ProyectoDetalle />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacto" element={<Contacto />} />
        </Route>

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/proyectos" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/proyectos/:id" element={<PrivateRoute><AdminProyecto /></PrivateRoute>} />
        <Route path="/admin/galeria" element={<PrivateRoute><AdminGaleria /></PrivateRoute>} />
        <Route path="/admin/categorias" element={<PrivateRoute><AdminCategorias /></PrivateRoute>} />
        <Route path="/admin/leads" element={<PrivateRoute><AdminLeads /></PrivateRoute>} />
        <Route path="/admin/sitio" element={<PrivateRoute><AdminSitio /></PrivateRoute>} />
      </Routes>
    </Suspense>
  </BrowserRouter>
  )
}

export default App
