const siteKey = '6LfY0fooAAAAAKaljIbo723ZiMGApMCVg6ZU805o'

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
