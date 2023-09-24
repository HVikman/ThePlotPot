import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AutoComplete, Collapse, Button, Input, Form } from 'antd'
import genres from './genres'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import '../../utils/charactercounter'
import './quill.css'

import { useAuth } from '../auth/AuthContext'
import { useNotifications } from '../../components/NotificationsContext'
import { useCreateStory } from '../../hooks/createStory'

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
  genre: ''
}

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

const StoryForm = () => {
  const { addNotification } = useNotifications()
  const { user } = useAuth()
  const isAuthenticated = !!user

  const [disabledPanels, setDisabledPanels] = useState('disabled')

  const createStory = useCreateStory(addNotification)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      createStory({
        variables: {
          title: values.title,
          description: values.description,
          genre: values.genre,
          firstChapterContent: values.content
        }
      }).catch(error => {
        console.error('There was an error creating the chapter:', error)
        addNotification(`Something went wrong: ${error}`, 3000, 'error')
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

  if (!isAuthenticated) {
    return <p>You are not logged in.</p>
  }

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
            onChange={value => formik.setFieldValue('content', value)}
            theme="snow"
            modules={quillModules}
          />
          <div id="character-count"></div>
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
