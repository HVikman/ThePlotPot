import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { SIGNUP_MUTATION } from '../../api/queries'

const SignupSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Signup = () => {
  const [signup, { error }] = useMutation(SIGNUP_MUTATION)

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      const response = await signup({ variables: values })
      console.log(response)
    },
  })

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Username"
        />
        {formik.touched.username && formik.errors.username ? <div>{formik.errors.username}</div> : null}

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

        <button type="submit">Signup</button>
      </form>
      {/* Handle any error messages here */}
      {error && <p>{error.message}</p>}
    </div>
  )
}

export default Signup