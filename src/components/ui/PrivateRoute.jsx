import { Navigate } from 'react-router-dom'

// Phase 1: password stored in env var
// Phase 2: replace with Supabase Auth session check
const isAuthenticated = () => {
  return sessionStorage.getItem('arbora_admin') === 'true'
}

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin" replace />
  }
  return children
}

export default PrivateRoute
