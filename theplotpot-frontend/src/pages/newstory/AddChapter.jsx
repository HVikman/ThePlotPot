import { useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, FormControl } from 'react-bootstrap'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import '../../utils/charactercounter'
import { useCreateChapter } from '../../hooks/createChapter'
import { useNotifications } from '../../components/NotificationsContext'
import './quill.css'
import { useDarkMode } from '../../components/DarkModeContext'


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
  const { isDarkMode } = useDarkMode()
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
      <Form onSubmit={formik.handleSubmit} className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <FormControl
            type="text"
            placeholder="Chapter title"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && <Form.Text className="text-danger">{formik.errors.title}</Form.Text>}
        </Form.Group>
        <Form.Group style={{ display: 'none' }} controlId="formHoneypot">
          <FormControl
            type="text"
            name="honeypot"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.honeypot}
          />
        </Form.Group>
        <Form.Group controlId="formContent">
          <Form.Label>Content</Form.Label>
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
          {formik.touched.content && formik.errors.content && <Form.Text className="text-danger">{formik.errors.content}</Form.Text>}
        </Form.Group>
      </Form>

      {/*
      {error && <Alert type="error" message={error.message} className="mt-3" />} */}
      {error}
    </div>
  )
}

export default AddChapter
