import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Preloader from './components/ui/Preloader'
import { initLenis, destroyLenis } from './lib/lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Proyectos from './pages/Proyectos'
import ProyectoDetalle from './pages/ProyectoDetalle'
import Galeria from './pages/Galeria'
import Servicios from './pages/Servicios'
import About from './pages/About'
import Contacto from './pages/Contacto'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProyecto from './pages/admin/AdminProyecto'
import AdminGaleria from './pages/admin/AdminGaleria'
import AdminCategorias from './pages/admin/AdminCategorias'
import AdminLeads from './pages/admin/AdminLeads'
import AdminSitio from './pages/admin/AdminSitio'
import PrivateRoute from './components/ui/PrivateRoute'

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
  </BrowserRouter>
  )
}

export default App