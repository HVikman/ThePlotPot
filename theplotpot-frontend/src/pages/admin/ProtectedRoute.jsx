import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../pages/auth/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user && user.has_superpowers? children : <Navigate to="/" />
}
export default ProtectedRoute