import { useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, FormControl, Button } from 'react-bootstrap'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import '../../utils/charactercounter'
import { useCreateChapter } from '../../hooks/createChapter'
import { useNotifications } from '../../components/NotificationsContext'
import './quill.css'
import { useDarkMode } from '../../components/DarkModeContext'
import '../../utils/theme.css'
// Quill modules
const quillModules = {
  characterCounter: {
    container: '#char-count',
    maxChars: 12000
  },
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  ]
}

// Form validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Required')
    .max(100, 'Must be 100 characters or less'),
  content: Yup.string()
    .required('Required')
    .max(12000, 'Content must be 12000 characters or less'),
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
  const [createChapter] = useCreateChapter(storyId, parentChapter, navigationStack, addNotification)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (values.honeypot) {
        console.log('Bot detected')
        return
      }
      createChapter({
        variables: {
          storyId: storyId,
          parentChapterId: parentChapter.id,
          branch: parentChapter.branch + 1,
          title: values.title,
          content: values.content,
        }
      }).catch(error => {
        console.error('There was an error creating the chapter:', error)
        addNotification(error.message, 3000, 'error')
      })
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
          {formik.touched.title && formik.errors.title && (
            <Form.Text className="text-danger">{formik.errors.title}</Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formHoneypot">
          <FormControl
            type="text"
            name="honeypot"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.honeypot}
            style={{ display: 'none' }}
          />
        </Form.Group>

        <Form.Group controlId="formContent">
          <Form.Label>Content</Form.Label>
          <ReactQuill
            value={formik.values.content}
            placeholder='Chapter content goes here...'
            onChange={value => formik.setFieldValue('content', value)}
            onBlur={() => formik.setFieldTouched('content', true)}
            theme="snow"
            modules={quillModules}
          />
          {formik.touched.content && formik.errors.content && (
            <Form.Text className="text-danger">{formik.errors.content}</Form.Text>
          )}
          <div id='char-count'></div>
        </Form.Group>

        <Button variant='secondary' type="submit">Submit</Button>
      </Form>
    </div>
  )
}

export default AddChapter
