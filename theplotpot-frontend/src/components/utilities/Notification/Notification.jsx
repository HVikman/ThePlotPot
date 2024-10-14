import { notification } from 'antd'
import { useEffect } from 'react'
import { useNotifications } from '../../../context/NotificationsContext'

const Notification = () => {
  const { notifications } = useNotifications()


  useEffect(() => {
    notifications.forEach(notification => {
      openAntDesignNotification(notification.message, notification.duration/1000, notification.type)
    })
  }, [notifications])

  const openAntDesignNotification = (message, duration, type) => {
    const notificationStyle = {
      backgroundColor: 'rgba(52, 58, 64, 0.9)',
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)'
    }

    notification.open({
      description: (<div style={{ color: 'white' }}>{message}</div>),
      duration: duration,
      type: type,
      style: notificationStyle,
      placement: 'bottomRight'
    })
  }

  return null
}

export default Notification
