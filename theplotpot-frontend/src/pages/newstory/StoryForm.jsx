import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AutoComplete, Collapse, Button, Input, Form } from 'antd'
import genres from './genres'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import '../../utils/wordcounter'
import { useMutation } from '@apollo/client'
import { CREATE_STORY } from '../../api/queries'
import { useAuth } from '../auth/AuthContext'

const StoryForm = () => {
  const { user } = useAuth()
  const isAuthenticated = !!user

  const MAX_WORDS = 2000
  const [disabledPanels, setDisabledPanels] = useState('disabled')
  const [createStory] = useMutation(CREATE_STORY)


  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      content: '',
      genre: ''
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Required')
        .max(100, 'Must be 100 characters or less'),
      description: Yup.string()
        .required('Required')
        .max(500, 'Must be 450 characters or less'),
      content: Yup.string().required('Required'),
      genre: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      createStory({
        variables: {
          title: values.title,
          description: values.description,
          genre: values.genre,
          firstChapterContent: values.content
        }
      }).then(response => {
        console.log(response.data)
        if (response.data.createStory.success) {
          console.log('Story created successfully with ID:', response.data.createStory.story.id)
        } else {
          console.log('Error creating story:', response.data.createStory.message)
        }
      }).catch(err => {
        console.error('There was an error creating the story:', err)
      })
    },
  })
  useEffect(() => {
    if (formik.values.title && formik.values.description && formik.values.genre) {
      setDisabledPanels('')
    } else {
      setDisabledPanels('disabled')
    }
  }, [formik.values.title, formik.values.description, formik.values.genre])
  if(!isAuthenticated){return <p>You are not logged in.</p>}
  const items = [
    {
      key: '1',
      label: 'Step 1: Basic Details',
      children: (
        <Form layout="vertical" onSubmit={formik.handleSubmit}>
          <Form.Item label="Title" help={formik.touched.title && formik.errors.title}>
            <Input
              type="text"
              name="title"
              placeholder="Give your story a cool title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
          </Form.Item>
          <Form.Item label="Description" help={formik.touched.description && formik.errors.description}>
            <Input.TextArea
              name="description"
              placeholder='Captivating description goes here!'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Genre" help={formik.touched.genre && formik.errors.genre}>
            <AutoComplete
              value={formik.values.genre}
              onChange={value => formik.setFieldValue('genre', value)}
              style={{ width: '100%' }}
              options={genres.map(genre => ({ value: genre }))}
              placeholder="Select a genre"
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().includes(inputValue.toUpperCase())
              }
            />
          </Form.Item>
        </Form>
      )
    },
    {
      key: '2',
      collapsible: disabledPanels,
      label: 'Step 2: Story Content',
      children: (
        <>
          <ReactQuill
            value={formik.values.content}
            placeholder='Compose an epic start of a story...'
            onChange={value => formik.setFieldValue('content', value)}
            theme="snow"
            style={{ marginBottom: '15px' }}
            modules={{
              wordCounter: {
                container: '#word-count',
                maxWords: MAX_WORDS
              },
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ]
            }}
          />
          <div><div id='word-count'></div>words</div>
          <Button type="primary" onClick={() => formik.handleSubmit()}>Submit</Button>
        </>
      )
    }
  ]

  return (
    <Collapse items={items} defaultActiveKey={['1']} />
  )
}

export default StoryForm
