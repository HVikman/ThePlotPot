import { createContext, useContext, useState, useEffect } from 'react'

export const DarkModeContext = createContext()

export const useDarkMode = () => useContext(DarkModeContext)

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => JSON.parse(localStorage.getItem('darkMode')) || false
  )

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}