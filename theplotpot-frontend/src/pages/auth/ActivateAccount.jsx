import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'


function ActivateAccount() {
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (token) {
      console.log(token)
    }
  }, [location])

  /*   if (data && data.activateAccount.success) {
    return <div>Account activated successfully!</div>
  } */

  return <div>Activating your account...</div>
}

export default ActivateAccount
