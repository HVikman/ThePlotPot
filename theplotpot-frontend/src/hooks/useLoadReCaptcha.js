import { useEffect } from 'react'

export const useLoadReCaptcha = (siteKey) => {
  useEffect(() => {
    if (!window.grecaptcha) {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }
  }, [siteKey])
}
