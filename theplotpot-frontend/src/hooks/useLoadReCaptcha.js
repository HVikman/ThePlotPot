import { useEffect } from 'react'

export const useLoadReCaptcha = () => {
  const siteKey = process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY
  useEffect(() => {
    if (!siteKey) return
    if (window.grecaptcha) return

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [siteKey])
}