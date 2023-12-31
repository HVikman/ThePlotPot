import { useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Input, Form, Alert } from 'antd'
import { Button } from 'react-bootstrap'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import '../../utils/charactercounter'
import { useCreateChapter } from '../../hooks/createChapter'
import { useNotifications } from '../../components/NotificationsContext'
import './quill.css'

// Form validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Required')
    .max(100, 'Must be 100 characters or less'),
  content: Yup.string().required('Required')
})

const initialValues = {
  title: '',
  content: '',
  honeypot: ''
}

const AddChapter = () => {

  const location = useLocation()
  const { storyId, parentChapter, navigationStack } = location.state
  const { addNotification } = useNotifications()
  const [createChapter, error] = useCreateChapter(storyId, parentChapter, navigationStack, addNotification)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (values.honeypot) {
        console.log('Bot detected')
        return
      }
      // eslint-disable-next-line no-undef
      grecaptcha.ready(async () => {
        // eslint-disable-next-line no-undef
        const token = await grecaptcha.execute('6LfY0fooAAAAAKaljIbo723ZiMGApMCVg6ZU805o', { action: 'submit' })

        createChapter({
          variables: {
            storyId: storyId,
            parentChapterId: parentChapter.id,
            branch: parentChapter.branch + 1,
            title: values.title,
            content: values.content,
            token
          }
        }).catch(error => {
          console.error('There was an error creating the chapter:', error)
          addNotification(error.message, 3000, 'error')
        })})
    },
  })

  return (
    <div className="add-chapter-container mx-4">
      <h2>Add a New Chapter</h2>
      <Form layout="vertical" onSubmit={formik.handleSubmit}>
        <Form.Item label="Title" help={formik.touched.title && formik.errors.title}>
          <Input
            type="text"
            name="title"
            placeholder="Chapter title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
        </Form.Item>
        <Form.Item style={{ display: 'none' }}>
          <Input
            type="text"
            name="honeypot"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.honeypot}
          />
        </Form.Item>
        <Form.Item label="Content" help={formik.touched.content && formik.errors.content}>
          <ReactQuill
            value={formik.values.content}
            placeholder='Chapter content goes here...'
            onChange={value => formik.setFieldValue('content', value)}
            theme="snow"
            modules={{
              characterCounter: {
                container: '#char-count',
                maxChars: 12000
              },
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ]
            }}
          />
          <div id='char-count'></div>
        </Form.Item>
        <Button variant='secondary' onClick={() => formik.handleSubmit()}>Submit</Button>
      </Form>
      {error && <Alert type="error" message={error.message} className="mt-3" />}
    </div>
  )
}

export default AddChapter
