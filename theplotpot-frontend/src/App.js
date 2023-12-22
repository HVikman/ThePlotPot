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
import UserPage from './pages/users/UserPage'
import './App.css'
import InfoModal from './components/InfoModal'
import DarkModeToggle from './components/DarkModeToggle'

const Home = lazy(() => import('./pages/home/Home'))
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const StoryForm = lazy(() => import('./pages/newstory/StoryForm'))
const StoryPage = lazy(() => import('./pages/storypage/StoryPage'))
const AddChapter = lazy(() => import('./pages/newstory/AddChapter'))
const StoriesPage = lazy(() => import('./pages/stories/StoriesPage'))
const UserSettings = lazy(() => import('./pages/users/UserSettings'))
const CookieConsentPopup = lazy(() => import('./components/CookieConsentPopup'))
const ActivateAccount = lazy(() => import('./pages/auth/ActivateAccount'))
const ProtectedRoute = lazy(() => import('./pages/admin/ProtectedRoute'))
const UserList = lazy(() => import('./pages/admin/UserList'))
const NotFoundPage = lazy(() => import('./pages/notfound/NotFoundPage'))


const App = () => {
  const [showCookiePopup, setShowCookiePopup] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  useEffect(() => {
    if (!Cookies.get('cookieConsent')) {
      setShowCookiePopup(true)
    }
  }, [])
  const handleConsent = () => {
    Cookies.set('cookieConsent', 'true', { expires: 365 })
    setShowCookiePopup(false)
    setTimeout(() => {
      setShowInfo(true)
    }, 5000)
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
              <Route path='/user/:id' element={<UserPage />} />
              <Route path="/" element={<Home />} />
              <Route path="/story/:storyId/chapter/:chapterId" element={<StoryPage />} />
              <Route path="/story/:storyId" element={<StoryPage />} />
              <Route path="/add-chapter" element={<AddChapter />} />
              <Route path="/usersettings" element={<UserSettings />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/activate" element={<ActivateAccount />} />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <UserList />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
        <Notification />
      </Router>
      {showCookiePopup && (
        <Suspense fallback={<div>Loading...</div>}>
          <CookieConsentPopup onConsent={handleConsent} />
        </Suspense>
      )}
      {showInfo && <InfoModal />}
      <Footer></Footer>
      <DarkModeToggle />
    </div>

  )
}

export default App

