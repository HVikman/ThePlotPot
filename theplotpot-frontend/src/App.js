import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StoryForm from './pages/newstory/StoryForm'
import StoryPage from './pages/storypage/StoryPage'
import AddChapter from './pages/newstory/AddChapter'
import UserSettings from './pages/users/UserSettings'
import Notification from './components/Notification'

import './App.css'
import Cookies from 'js-cookie'
import CookieConsentPopup from './components/CookieConsentPopup'


const App = () => {
  const [showCookiePopup, setShowCookiePopup] = useState(false)
  useEffect(() => {
    if (!Cookies.get('cookieConsent')) {
      setShowCookiePopup(true)
    }
  }, [])
  const handleConsent = () => {
    Cookies.set('cookieConsent', 'true', { expires: 365 })
    setShowCookiePopup(false)
  }


  return (

    <div id="app">
      <Router>
        <Navbar/>
        <div className="main-content">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path='/story' element={<StoryForm />} />
            <Route path="/" element={<Home />} />
            <Route path="/story/:storyId" element={<StoryPage />} />
            <Route path="/add-chapter" element={<AddChapter />} />
            <Route path="/usersettings" element={<UserSettings />} />
          </Routes>
        </div>
        <Notification />
      </Router>
      {showCookiePopup && <CookieConsentPopup onConsent={handleConsent} />}
      <Footer></Footer>
    </div>

  )
}

export default App

