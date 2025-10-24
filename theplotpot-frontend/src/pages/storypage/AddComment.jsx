import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button } from 'react-bootstrap'
import { useNotifications } from '../../context/NotificationsContext'
import { useMutation } from '@apollo/client'
import { ADD_COMMENT_MUTATION } from '../../api/queries'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLoadReCaptcha } from '../../hooks/useLoadReCaptcha'
import { executeRecaptcha } from '../../utils/executeRecaptcha'
import './StoryPage.css'

const validationSchema = Yup.object({
  content: Yup.string()
    .required('Required')
    .min(10, 'Comment must be atleast 10 characters')
    .max(1000, 'Must be 1000 characters or less')
})

const initialValues = {
  content: '',
  honeypot: ''
}

const siteKey = process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY

const AddCommentForm = ({ chapterId, addNewComment }) => {
  useLoadReCaptcha()
  const { addNotification } = useNotifications()

  const [addComment] = useMutation(ADD_COMMENT_MUTATION)
  const { isDarkMode } = useDarkMode()

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log('Chapter ID:', chapterId)

      if (values.honeypot) {
        console.log('Bot detected')
        return
      }

      let token = null
      if (siteKey){
        try {
          token = await executeRecaptcha()
        } catch (error) {
          console.error('reCAPTCHA verification failed:', error)
          addNotification('Failed to verify you are human. Please try again.', 3000, 'error')
          return
        }}

      try {
        const { data } = await addComment({
          variables: {
            Input: {
              content: values.content,
              chapterId
            },
            token
          }
        })

        addNewComment(data.addComment)
        addNotification('Comment added successfully!', 3000, 'success')
        formik.resetForm()

      } catch (error) {
        console.error('There was an error adding the comment:', error)
        addNotification(error.message, 3000, 'error')
      }
    },
  })

  return (
    <div className={`add-comment-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div>
        <h3 className="add-comment-card__title">Add a comment</h3>
        <p className="add-comment-card__subtitle">Keep it kind and constructive to help writers grow.</p>
      </div>
      <Form onSubmit={formik.handleSubmit} className="add-comment-card__form">
        <Form.Group controlId="commentContent" className={`custom-form ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <Form.Control
            as="textarea"
            className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}
            name="content"
            placeholder="Share your feedback..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.content}
            isInvalid={formik.touched.content && formik.errors.content}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.content}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Control style={{ display: 'none' }} name="honeypot" onChange={formik.handleChange} value={formik.values.honeypot}/>

        <Button variant={isDarkMode ? 'outline-light' : 'outline-dark'} type="submit">Post comment</Button>
      </Form>
    </div>
  )
}

export default AddCommentForm
