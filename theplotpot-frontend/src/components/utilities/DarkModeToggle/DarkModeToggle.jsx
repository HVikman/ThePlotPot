import React, { useEffect, useState } from 'react'
import './DarkModeToggle.css'
import { useDarkMode } from '../../../context/DarkModeContext'
import { LightbulbFill } from 'react-bootstrap-icons'

const DarkModeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useDarkMode()
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#323232'
      document.body.style.color = '#f5f5f5'
    } else {
      document.body.style.backgroundColor = 'white'
      document.body.style.color = 'black'
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    setRotation(prev => prev + 360)
  }


  return (
    <div
      className={`mode-toggle ${isDarkMode ? 'bulb-off' : 'bulb-on'}`}
      onClick={toggleDarkMode}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-checked={isDarkMode}
      role="switch"
      aria-label="Toggle Dark Mode"
    >
      <LightbulbFill size={50} className="bulb-icon" />
    </div>
  )
}

export default DarkModeToggle
