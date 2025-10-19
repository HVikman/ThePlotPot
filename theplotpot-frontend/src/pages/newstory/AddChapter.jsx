import { useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, FormControl, Button } from 'react-bootstrap'
import TextEditor from '../../components/utilities/TextEditor'
import { useCreateChapter } from '../../hooks/useCreateChapter.js'
import { useNotifications } from '../../context/NotificationsContext'
import { useDarkMode } from '../../context/DarkModeContext'
import '../../utils/theme.css'
import { useLoadReCaptcha } from '../../hooks/useLoadReCaptcha'
import { executeRecaptcha } from '../../utils/executeRecaptcha'

const MAX_CHARACTERS = 12000

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Required')
    .max(100, 'Must be 100 characters or less'),
  content: Yup.string()
    .required('Required')
    .max(MAX_CHARACTERS, `Content must be ${MAX_CHARACTERS} characters or less`),
})

const initialValues = {
  title: '',
  content: '',
  honeypot: '',
}

const siteKey = process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY

const AddChapter = () => {
  useLoadReCaptcha()
  const { isDarkMode } = useDarkMode()
  const location = useLocation()
  const { storyId, parentChapter, navigationStack } = location.state
  const { addNotification } = useNotifications()
  const [createChapter] = useCreateChapter(storyId, parentChapter, navigationStack, addNotification)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
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
      else {console.log('reCaptcha skipped')}

      try {
        await createChapter({
          variables: {
            storyId: storyId,
            parentChapterId: parentChapter.id,
            branch: parentChapter.branch + 1,
            title: values.title,
            content: values.content,
            token,
          },
        })

        addNotification('Chapter created successfully!', 3000, 'success')

      } catch (error) {
        console.error('There was an error creating the chapter:', error)
        addNotification(error.message, 3000, 'error')
      }
    },
  })

  const handleEditorUpdate = (updatedContent) => {
    formik.setFieldValue('content', updatedContent)
  }

  return (
    <div className="add-chapter-container mx-4">
      <h2>Add a New Chapter</h2>
      <Form onSubmit={formik.handleSubmit} className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>

        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <FormControl
            type="text"
            placeholder="Give your story a cool title"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          <div
            className={`character-counter ${
              formik.values.title.length > 80 ? 'warning' : ''
            }`}
          >
            {formik.values.title.length}/100 characters
          </div>
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
          <TextEditor
            content={formik.values.content}
            onUpdate={handleEditorUpdate}
            characterLimit={MAX_CHARACTERS}
          />
          {formik.touched.content && formik.errors.content && (
            <Form.Text className="text-danger">{formik.errors.content}</Form.Text>
          )}
        </Form.Group>

        <Button variant="secondary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default AddChapter
