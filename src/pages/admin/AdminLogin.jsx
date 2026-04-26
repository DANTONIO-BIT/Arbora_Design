import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'arbora2024'

    if (password === adminPassword) {
      sessionStorage.setItem('arbora_admin', 'true')
      navigate('/admin/proyectos')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-2">Arbora Hogar</h1>
          <p className="text-on-surface-variant">CMS Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 bg-surface border border-outline/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
            />
          </div>
          
          {error && <p className="text-red-800 text-sm text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-primary text-on-primary px-8 py-3 rounded-md 
                     font-semibold hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminLogin