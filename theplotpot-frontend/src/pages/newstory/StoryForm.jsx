import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { Form, Button, Accordion, FormControl, Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import genres from './genres'
import TextEditor from '../../components/utilities/TextEditor'
import '../../utils/theme.css'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useCreateStory } from '../../hooks/useCreateStory.js'
import { useDarkMode } from '../../context/DarkModeContext'
import { useLoadReCaptcha } from '../../hooks/useLoadReCaptcha'
import { executeRecaptcha } from '../../utils/executeRecaptcha'
import './NewStory.css'

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
  const themeClass = isDarkMode ? 'dark-mode' : 'light-mode'
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false)

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
          <span className="story-builder-eyebrow">Create a story</span>
          <h1 className="story-builder-title">Craft your branching adventure</h1>
          <p className="story-builder-description">
            Introduce your world, set the tone, and publish your first chapter. You can
            always return to expand the branches once readers start exploring.
          </p>
        </div>
        <Form
          className="story-builder-form"
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit(e)
          }}
        >
          <Accordion defaultActiveKey="0" className="story-builder-accordion">
            <Accordion.Item eventKey="0" className={themeClass}>
              <Accordion.Header>Step 1: Basic details</Accordion.Header>
              <Accordion.Body>
                <div className="story-builder-fields">
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
                      placeholder="Give readers a captivating synopsis"
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
                    <Dropdown
                      onSelect={(eventKey) => {
                        formik.setFieldValue('genre', eventKey)
                        formik.setFieldTouched('genre', true, true)
                      }}
                      onToggle={(nextOpen) => {
                        setIsGenreMenuOpen(nextOpen)
                        if (!nextOpen) {
                          formik.setFieldTouched('genre', true, true)
                        }
                      }}
                      show={isGenreMenuOpen}
                      className={`genre-select ${isDarkMode ? 'dark-mode' : 'light-mode'} ${
                        formik.touched.genre && formik.errors.genre ? 'has-error' : ''
                      }`}
                    >
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        className="genre-select-toggle"
                        id="genre-dropdown"
                        data-bs-theme={isDarkMode ? 'dark' : 'light'}
                      >
                        {formik.values.genre || 'Select genre'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="genre-select-menu"
                        data-bs-theme={isDarkMode ? 'dark' : 'light'}
                      >
                        {genres.map((genre) => (
                          <Dropdown.Item
                            key={genre}
                            eventKey={genre}
                            active={formik.values.genre === genre}
                          >
                            {genre}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {formik.touched.genre && formik.errors.genre && (
                      <Form.Text className="text-danger">{formik.errors.genre}</Form.Text>
                    )}
                  </Form.Group>
                  <FormControl
                    type="text"
                    name="honeypot"
                    onChange={formik.handleChange}
                    value={formik.values.honeypot}
                    className="d-none"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className={themeClass}>
              <Accordion.Header>Step 2: Story content</Accordion.Header>
              <Accordion.Body>
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
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <div className="story-builder-footer">
            <Button variant="secondary" type="submit" size="lg">
              Publish story
            </Button>
          </div>
        </Form>
      </div>
    </section>
  )
}

export default StoryForm
