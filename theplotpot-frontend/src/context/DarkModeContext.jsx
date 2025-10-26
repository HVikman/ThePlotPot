import { createContext, useContext, useState, useEffect } from 'react'

export const DarkModeContext = createContext()

export const useDarkMode = () => useContext(DarkModeContext)

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkModeState] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  const [userHasSetPreference, setUserHasSetPreference] = useState(
    localStorage.getItem('darkMode') !== null
  )

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      setIsDarkModeState(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (!userHasSetPreference) {
        setIsDarkModeState(e.matches)
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [userHasSetPreference])

  const setIsDarkMode = (value) => {
    setIsDarkModeState(value)
    setUserHasSetPreference(true)
    localStorage.setItem('darkMode', JSON.stringify(value))
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}
