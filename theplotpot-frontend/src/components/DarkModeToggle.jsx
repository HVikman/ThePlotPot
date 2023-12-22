import { useEffect } from 'react'
import { Switch } from 'antd'
import { Sun, Moon } from 'react-bootstrap-icons'
import { useDarkMode } from './DarkModeContext'

const DarkModeToggle = () => {
  const { isDarkMode, setIsDarkMode } = useDarkMode()

  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#323232'
      document.body.style.color = '#f5f5f5'
    } else {
      document.body.style.backgroundColor = 'white'
      document.body.style.color = 'black'
    }
  }, [isDarkMode])

  const toggleDarkMode = (checked) => {
    setIsDarkMode(checked)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed',
      bottom: '20px',
      left: '20px', backgroundColor: '#343a40',
      borderRadius: '10px',
      padding: '10px',
      zIndex: 1000 }}>
      <Sun color={isDarkMode ? 'grey' : 'yellow'} />
      <Switch
        checkedChildren={<Moon />}
        unCheckedChildren={<Sun />}
        checked={isDarkMode}
        onChange={toggleDarkMode}
        style={{ margin: '0 10px' }}
      />
      <Moon color={isDarkMode ? 'white' : 'grey'} />
    </div>
  )
}

export default DarkModeToggle
