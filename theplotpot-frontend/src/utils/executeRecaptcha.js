const siteKey = process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY

export const executeRecaptcha = (action = 'submit') => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      return reject(new Error('reCAPTCHA not loaded yet'))
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action })
        .then(token => resolve(token))
        .catch(err => reject(err))
    })
  })
}
