import { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const getWhatsAppMessage = (pathname) => {
  const messages = {
    '/': 'Hola, me gustaría agendar una visita',
    '/proyectos': 'Hola, quiero ver más proyectos',
    '/proyectos/': 'Hola, me interesa el proyecto',
    '/servicios': 'Hola, quiero información sobre servicios',
    '/contacto': 'Hola, quiero más información',
    '/about': 'Hola, me interesa conocer más',
  }
  
  return messages[pathname] || messages['/']
}

const WhatsAppButton = () => {
  const location = useLocation()
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+56900000000'

  useGSAP(() => {
    gsap.set(contentRef.current, { 
      x: 20, 
      opacity: 0, 
      pointerEvents: 'none' 
    })
  }, { scope: containerRef })

  const handleMouseEnter = () => {
    setIsOpen(true)
    gsap.to(contentRef.current, {
      x: 0,
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    setIsOpen(false)
    gsap.to(contentRef.current, {
      x: 20,
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.2,
      ease: 'power2.in'
    })
  }

  const handleClick = () => {
    if (window.innerWidth < 768) {
      const message = getWhatsAppMessage(location.pathname)
      const waLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      window.open(waLink, '_blank')
    } else {
      handleMouseEnter()
    }
  }

  const quickOptions = [
    { label: 'Agendar visita', message: 'Hola, me gustaría agendar una visita' },
    { label: 'Pedir cotizacion', message: 'Hola, quiero pedir una cotización' },
    { label: 'Consultar servicios', message: 'Hola, quiero información sobre servicios' },
  ]

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 right-8 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Quick options - solo desktop */}
      <div 
        ref={contentRef}
        className="absolute right-16 bottom-0 flex flex-col gap-2 pointer-events-none"
      >
        {quickOptions.map((option, index) => {
          const waLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(option.message)}`
          return (
            <a
              key={index}
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-sm font-serif text-on-surface px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
            >
              {option.label}
            </a>
          )
        })}
      </div>
      
      {/* Botón flotante */}
      <button
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_40px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_50px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.587.149-.122.446-.521.607-.696.159-.174.397-.198.59-.247.297-.05.768-.121.951.473.18.595.622.696.714.696.119 0 .272-.049.396-.087.173-.049.297-.074.42-.049.297.149 1.271.768 1.372 1.105.099.297.099.596.074.694-.074.297-.768 1.373-.833 1.468-.05.099-.223.099-.446.049-.173-.149-.768-.595-1.163-.992-.347-.347-.595-.768-.694-1.163-.074-.347.049-.694.273-.97.297-.347.693-.748 1.042-.991.174-.124.347-.248.494-.372.297-.248.397-.347.495-.496.074-.149.099-.298.049-.446-.074-.198-.297-.595-.446-.893-.149-.297-.297-.496-.545-.694-.173-.174-.347-.347-.495-.52z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.55 4.12 1.524 5.857L.083 23.456a.75.75 0 0 0 .937.915l5.588-1.749A11.91 11.91 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.5a10.457 10.457 0 0 1-5.347-1.455.75.75 0 0 0-.671-.072l-4.22 1.32.96-3.21a.75.75 0 0 0-.075-.634A10.453 10.453 0 0 1 1.5 12c0-5.799 4.701-10.5 10.5-10.5S22.5 6.201 22.5 12 17.799 22.5 12 22.5z"/>
        </svg>
      </button>
    </div>
  )
}

export default WhatsAppButton