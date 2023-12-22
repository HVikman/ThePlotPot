import { useAuth } from '../../pages/auth/AuthContext'
import NotFoundPage from '../../pages/notfound/NotFoundPage'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  console.log(children)
  return user && user.has_superpowers? children : <NotFoundPage />
}
export default ProtectedRoute