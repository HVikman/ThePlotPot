import { Link, useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, FormControl, Button } from 'react-bootstrap'
import TextEditor from '../../components/utilities/TextEditor'
import { useCreateChapter } from '../../hooks/useCreateChapter.js'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useDarkMode } from '../../context/DarkModeContext'
import '../../utils/theme.css'
import { useLoadReCaptcha } from '../../hooks/useLoadReCaptcha'
import { executeRecaptcha } from '../../utils/executeRecaptcha'
import './NewStory.css'

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
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { isDarkMode } = useDarkMode()
  const location = useLocation()
  const { storyId, parentChapter, navigationStack } = location.state
  const { addNotification } = useNotifications()
  const [createChapter] = useCreateChapter(storyId, parentChapter, navigationStack, addNotification)
  const themeClass = isDarkMode ? 'dark-mode' : 'light-mode'

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
  if (!isAuthenticated) {
    return (
      <section className="story-builder-wrapper">
        <div className={`story-builder-card ${themeClass}`}>
          <div className="story-builder-header">
            <span className="story-builder-eyebrow">Start a story</span>
            <h1 className="story-builder-title">Join ThePlotPot to start writing</h1>
            <p className="story-builder-description">
              Create a free account or sign in to build your own branching adventure. Once
              you&apos;re in, you can publish your opening chapter and invite others to explore
              every twist.
            </p>
          </div>
          <div className="story-builder-actions">
            <Button as={Link} to="/signup" variant="secondary" size="lg">
              Join
            </Button>
            <Button as={Link} to="/login" variant="outline-secondary" size="lg">
              Start Writing
            </Button>
          </div>
        </div>
      </section>
    )
  }


  const handleEditorUpdate = (updatedContent) => {
    formik.setFieldValue('content', updatedContent)
  }

  return (
    <section className="story-builder-wrapper">
      <div className={`story-builder-card ${themeClass}`}>
        <div className="story-builder-header">
          <span className="story-builder-eyebrow">Add a chapter</span>
          <h1 className="story-builder-title">Write the next branch</h1>
          <p className="story-builder-description">
            Continue the path you&apos;ve started or take the story in a fresh direction. Set the
            title, craft the prose, and publish when you&apos;re ready for readers to choose.
          </p>
        </div>
        <Form onSubmit={formik.handleSubmit} className="story-builder-form">
          <div className="story-builder-section">
            <h3>Chapter details</h3>
            <div className="story-builder-fields">
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <FormControl
                  type="text"
                  placeholder="Give this branch a memorable title"
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
              <FormControl
                type="text"
                name="honeypot"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.honeypot}
                className="d-none"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="story-builder-section">
            <h3>Chapter content</h3>
            <div className="story-builder-fields">
              <TextEditor
                content={formik.values.content}
                onUpdate={handleEditorUpdate}
                characterLimit={MAX_CHARACTERS}
              />
              {formik.touched.content && formik.errors.content && (
                <Form.Text className="text-danger">{formik.errors.content}</Form.Text>
              )}
            </div>
          </div>
          <div className="story-builder-footer">
            <Button variant="secondary" type="submit" size="lg">
              Publish chapter
            </Button>
          </div>
        </Form>
      </div>
    </section>
  )
}

export default AddChapter
