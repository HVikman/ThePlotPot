import { App as AntdApp } from 'antd'
import { useEffect, useRef } from 'react'
import { useNotifications } from '../../../context/NotificationsContext'

const Notification = () => {
  const { notifications } = useNotifications()
  const displayedNotifications = useRef(new Set())
  const { notification } = AntdApp.useApp()

  useEffect(() => {
    notifications.forEach((notif) => {
      if (!displayedNotifications.current.has(notif.id)) {
        openAntDesignNotification(notif.message, notif.duration / 1000, notif.type)
        displayedNotifications.current.add(notif.id)
      }
    })
  },)

  const openAntDesignNotification = (message, duration, type) => {
    notification.open({
      message: message,
      duration: duration,
      type: type,
      placement: 'bottomRight',
      style: {
        backgroundColor: 'rgba(52, 58, 64, 0.9)',
        borderRadius: 4,
        boxShadow: '0 3px 5px rgba(0,0,0,0.3)',
        color: 'white',
      },
    })
  }

  return null
}

export default Notification
