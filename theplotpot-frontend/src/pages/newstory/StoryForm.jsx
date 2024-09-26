import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button, Accordion, FormControl,FormSelect } from 'react-bootstrap'
import genres from './genres'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import '../../utils/charactercounter'
import './quill.css'
import '../../utils/theme.css'
import { useAuth } from '../auth/AuthContext'
import { useNotifications } from '../../components/NotificationsContext'
import { useCreateStory } from '../../hooks/createStory'
import { useDarkMode } from '../../components/DarkModeContext'

// Quill modules
const quillModules = {
  characterCounter: {
    container: '#character-count',
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
  description: Yup.string()
    .required('Required')
    .max(500, 'Must be 450 characters or less'),
  content: Yup.string().required('Required'),
  genre: Yup.string().required('Required')
})

const initialValues = {
  title: '',
  description: '',
  content: '',
  genre: '',
  honeypot: '',
}

const StoryForm = () => {
  const { addNotification } = useNotifications()
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { isDarkMode } = useDarkMode()
  const createStory = useCreateStory(addNotification)

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
        createStory({
          variables: {
            title: values.title,
            description: values.description,
            genre: values.genre,
            firstChapterContent: values.content,
            token
          }
        }).catch(error => {
          console.error('There was an error creating the chapter:', error)
          addNotification(error.message, 3000, 'error')
        })
      })
    },
  })

  if (!isAuthenticated) {
    return <p>You are not logged in.</p>
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
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
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <FormControl
                as="textarea"
                rows={4}
                placeholder="Captivating description goes here!"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
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
            <ReactQuill
              value={formik.values.content}
              onChange={value => formik.setFieldValue('content', value)}
              onBlur={() => formik.setFieldTouched('content', true)}
              theme="snow"
              modules={quillModules}
            />
            <div id="character-count"></div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Button variant='secondary' type="submit">Submit</Button>
    </Form>
  )
}

export default StoryForm
