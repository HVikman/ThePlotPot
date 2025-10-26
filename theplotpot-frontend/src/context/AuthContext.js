import { useState, useEffect, createContext, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { ME } from '../api/queries'

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  refreshUser: async () => {},
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const { data, loading, refetch } = useQuery(ME)

  useEffect(() => {
    if (data && data.me) {
      setUser(data.me)
    }
  }, [data])

  if (loading) return <p>Loading...</p>

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser: refetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}