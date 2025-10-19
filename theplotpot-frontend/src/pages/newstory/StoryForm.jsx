import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button, Accordion, FormControl,FormSelect } from 'react-bootstrap'
import genres from './genres'
import TextEditor from '../../components/utilities/TextEditor'
import '../../utils/theme.css'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useCreateStory } from '../../hooks/useCreateStory.js'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLoadReCaptcha } from '../../hooks/useLoadReCaptcha'
import { executeRecaptcha } from '../../utils/executeRecaptcha'

// Form validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Required')
    .max(100, 'Must be 100 characters or less'),
  description: Yup.string()
    .required('Required')
    .max(500, 'Must be 450 characters or less'),
  content: Yup.string().required('Required'),
  genre: Yup.string().required('Required')
})

const MAX_CHARACTERS = 12000

const initialValues = {
  title: '',
  description: '',
  content: '',
  genre: '',
  honeypot: '',
}

const siteKey = process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY

const StoryForm = () => {
  useLoadReCaptcha()
  const { addNotification } = useNotifications()
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { isDarkMode } = useDarkMode()
  const createStory = useCreateStory(addNotification)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log('Form submitted!', values)

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
        await createStory({
          variables: {
            title: values.title,
            description: values.description,
            genre: values.genre,
            firstChapterContent: values.content,
            token
          }
        })
        addNotification('Story created successfully!', 3000, 'success')
      } catch (error) {
        console.error('Error creating story:', error)
        addNotification('Failed to create story. Please try again.', 3000, 'error')
      }
    },
  })

  if (!isAuthenticated) {
    return <p>You are not logged in.</p>
  }

  const handleEditorUpdate = (updatedContent) => {
    formik.setFieldValue('content', updatedContent)
  }


  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault() // Prevent default behavior
        formik.handleSubmit(e) // Call Formik's submit handler
      }}
    >
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0" className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <Accordion.Header>Step 1: Basic Details</Accordion.Header>
          <Accordion.Body>
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
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <FormControl
                as="textarea"
                rows={4}
                placeholder="Captivating description goes here!"
                name="description"
                onChange={(e) => {
                  formik.handleChange(e)
                }}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              <div
                className={`character-counter ${
                  formik.values.description.length > 450 ? 'warning' : ''
                }`}
              >
                {formik.values.description.length}/500 characters
              </div>
              {formik.touched.description && formik.errors.description && (
                <Form.Text className="text-danger">{formik.errors.description}</Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="formGenre">
              <Form.Label>Genre</Form.Label>
              <FormSelect
                name="genre"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.genre}
                className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}
              >
                <option value="" label="Select genre" />
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </FormSelect>
            </Form.Group>
            {/* Honeypot Field */}
            <FormControl
              type="text"
              name="honeypot"
              onChange={formik.handleChange}
              value={formik.values.honeypot}
              style={{ display: 'none' }}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <Accordion.Header>Step 2: Story Content</Accordion.Header>
          <Accordion.Body>
            <TextEditor
              content={formik.values.content}
              onUpdate={handleEditorUpdate}
              characterLimit={MAX_CHARACTERS}
            />
            {formik.touched.content && formik.errors.content && (
              <Form.Text className="text-danger">{formik.errors.content}</Form.Text>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Button variant='secondary' type="submit">Submit</Button>
    </Form>
  )
}

export default StoryForm
