import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const isAuth = localStorage.getItem('resumelens-auth') === '1'
  if (isAuth) return children
  return <Navigate to="/signin" state={{ from: location }} replace />
}
