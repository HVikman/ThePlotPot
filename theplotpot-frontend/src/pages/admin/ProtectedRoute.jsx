import { useAuth } from '../../context/AuthContext'
import NotFoundPage from '../../pages/notfound/NotFoundPage'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user && user.has_superpowers? children : <NotFoundPage />
}
export default ProtectedRoute