import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button } from 'react-bootstrap'
import { useNotifications } from '../../context/NotificationsContext'
import { useMutation } from '@apollo/client'
import { ADD_COMMENT_MUTATION } from '../../api/queries'
import { useDarkMode } from '../../context/DarkModeContext'

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

const AddCommentForm = ({ chapterId, addNewComment }) => {
  const { addNotification } = useNotifications()

  const [addComment] = useMutation(ADD_COMMENT_MUTATION)
  const { isDarkMode } = useDarkMode()

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log(chapterId)
      if (values.honeypot) {
        console.log('Bot detected')
        return
      }
      // eslint-disable-next-line no-undef
      grecaptcha.ready(async () => {
        // eslint-disable-next-line no-undef
        const token = await grecaptcha.execute('6LfY0fooAAAAAKaljIbo723ZiMGApMCVg6ZU805o', { action: 'submit' })


        try {

          const { data } = await addComment({
            variables: {
              Input: {
                content: values.content,
                chapterId
              },
              token: token
            }
          })

          addNewComment(data.addComment)
          addNotification('Comment added successfully!', 3000, 'success')
          formik.resetForm()
        } catch (error) {
          console.error('There was an error adding the comment:', error)
          addNotification(error.message, 3000, 'error')
        }})
    },
  })

  return (
    <div className="add-comment-container mt-3">
      <h2>Add a Comment</h2>
      <Form onSubmit={formik.handleSubmit}>

        <Form.Group controlId="commentContent" className={`my-2 custom-form ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <Form.Control
            as="textarea"
            className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}
            name="content"
            placeholder="Your comment..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.content}
            isInvalid={formik.touched.content && formik.errors.content}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.content}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Control style={{ display: 'none' }} name="honeypot" onChange={formik.handleChange} value={formik.values.honeypot} />

        <Button variant="secondary" type="submit">Submit</Button>
      </Form>
    </div>
  )
}

export default AddCommentForm
