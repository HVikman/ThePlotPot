import { useState, useEffect, Suspense, lazy } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import { Spin } from 'antd'
import Cookies from 'js-cookie'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Notification from './components/Notification'
import CookieConsentPopup from './components/CookieConsentPopup'
import './App.css'

const Home = lazy(() => import('./pages/home/Home'))
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const StoryForm = lazy(() => import('./pages/newstory/StoryForm'))
const StoryPage = lazy(() => import('./pages/storypage/StoryPage'))
const AddChapter = lazy(() => import('./pages/newstory/AddChapter'))
const UserSettings = lazy(() => import('./pages/users/UserSettings'))

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
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spin size="large" /></div>}>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path='/story' element={<StoryForm />} />
              <Route path="/" element={<Home />} />
              <Route path="/story/:storyId/chapter/:chapterId" element={<StoryPage />} />
              <Route path="/story/:storyId" element={<StoryPage />} />
              <Route path="/add-chapter" element={<AddChapter />} />
              <Route path="/usersettings" element={<UserSettings />} />
            </Routes>
          </Suspense>
        </div>
        <Notification />
      </Router>
      {showCookiePopup && <CookieConsentPopup onConsent={handleConsent} />}
      <Footer></Footer>
    </div>

  )
}

export default App

