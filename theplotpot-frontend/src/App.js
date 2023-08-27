import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StoryForm from './pages/story/StoryForm'
import { ME } from './api/queries'
import { useQuery } from '@apollo/client'

import { AuthProvider } from './pages/auth/AuthContext'
import './App.css'

import Cookies from 'js-cookie'
import CookieConsentPopup from './components/CookieConsentPopup'


const App = () => {
  const [showCookiePopup, setShowCookiePopup] = useState(false)
  const { data, loading } = useQuery(ME)



  useEffect(() => {
    if (!Cookies.get('cookieConsent')) {
      setShowCookiePopup(true)
    }
  }, [])

  const handleConsent = () => {
    Cookies.set('cookieConsent', 'true', { expires: 365 })
    setShowCookiePopup(false)
  }

  if (loading) return <p>Loading...</p>
  console.log(!!data)

  return (
    <AuthProvider>
      <div id="app">
        <Router>
          <Navbar/>
          <div className="main-content">
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path='/story' element={<StoryForm />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>




        </Router>
        {showCookiePopup && <CookieConsentPopup onConsent={handleConsent} />}
        <Footer></Footer>
      </div></AuthProvider>
  )
}

export default App

