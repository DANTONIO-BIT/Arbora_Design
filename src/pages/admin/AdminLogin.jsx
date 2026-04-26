import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@arborahogar.com'

const AdminLogin = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    })

    if (authError) {
      setError('Contraseña incorrecta')
      setLoading(false)
      return
    }

    navigate('/admin/proyectos')
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
            disabled={loading}
            className="w-full bg-primary text-on-primary px-8 py-3 rounded-md
                     font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminLogin