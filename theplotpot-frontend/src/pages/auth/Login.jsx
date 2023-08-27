import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION } from '../../api/queries'
import {
  useNavigate
} from 'react-router-dom'
import { useAuth } from './AuthContext'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

const Login =() => {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [login, { error }] = useMutation(LOGIN_MUTATION)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const response = await login({ variables: values })
      console.log(response.data.login)
      setUser(response.data.login.user)
      navigate('/')
    },
  })

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Email"
        />
        {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}

        <input
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Password"
        />
        {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}

        <button type="submit">Login</button>
      </form>
      {/* Handle any error messages here */}
      {error && <p>{error.message}</p>}
    </div>
  )
}

export default Login