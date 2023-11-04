import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button } from 'react-bootstrap'
import { useNotifications } from '../../components/NotificationsContext'
import { useMutation } from '@apollo/client'
import { ADD_COMMENT_MUTATION } from '../../api/queries'

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

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log(chapterId)
      if (values.honeypot) {
        console.log('Bot detected')
        return
      }

      try {
        const { data } = await addComment({
          variables: {
            Input: {
              content: values.content,
              chapterId,
            }
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
    <div className="add-comment-container mt-3">
      <h2>Add a Comment</h2>
      <Form onSubmit={formik.handleSubmit}>

        <Form.Group controlId="commentContent" className='my-2 custom-form'>
          <Form.Control
            as="textarea"
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

        <div style={{ display: 'none' }}>
          <Form.Control name="honeypot" onChange={formik.handleChange} value={formik.values.honeypot} />
        </div>

        <Button variant="secondary" type="submit">Submit</Button>
      </Form>
    </div>
  )
}

export default AddCommentForm
