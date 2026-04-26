import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from '../ui/WhatsAppButton'
import PageCurtain from '../ui/PageCurtain'
import { usePageView } from '../../hooks/usePageView'

const Layout = () => {
  usePageView()

  return (
    <div className="flex flex-col min-h-screen">
      <PageCurtain />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default Layout
