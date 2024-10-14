import { createContext, useContext, useState } from 'react'

const NotificationsContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}


export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, duration = 3000, type = null) => {
    if (!notifications.some(notif => notif.message === message)) {
      const id = new Date().getTime()
      setNotifications([...notifications, { id, message, duration, type }])
      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
      }, duration)
    }
  }
  return (
    <NotificationsContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  )
}