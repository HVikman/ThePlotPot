import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Input, Form, Button } from 'antd'
import { useMutation } from '@apollo/client'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import '../../utils/wordcounter'
import { CREATE_CHAPTER } from '../../api/queries'

const AddChapter = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { storyId, parentChapterId, branch } = location.state

  const [createChapter] = useMutation(CREATE_CHAPTER)

  const formik = useFormik({
    initialValues: {
      title: '',
      content: ''
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Required')
        .max(100, 'Must be 100 characters or less'),
      content: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      createChapter({
        variables: {
          storyId: storyId,
          parentChapterId: parentChapterId,
          branch: branch + 1,
          title: values.title,
          content: values.content
        }
      }).then(response => {
        if (response.data.createChapter.id) {
          console.log('Chapter created successfully with ID:', response.data.createChapter.id)
          navigate(`/story/${storyId}`)
        } else {
          console.log('Error creating chapter:', response.data.createChapter.message)
        }
      }).catch(err => {
        console.error('There was an error creating the chapter:', err)
      })
    },
  })

  return (
    <div className="add-chapter-container">
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
        <Form.Item label="Content" help={formik.touched.content && formik.errors.content}>
          <ReactQuill
            value={formik.values.content}
            placeholder='Chapter content goes here...'
            onChange={value => formik.setFieldValue('content', value)}
            theme="snow"
            modules={{
              wordCounter: {
                container: '#word-count',
                maxWords: 2000 // Adjust this if needed
              },
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ]
            }}
          />
          <div><div id='word-count'></div> words</div>
        </Form.Item>
        <Button type="primary" onClick={() => formik.handleSubmit()}>Submit</Button>
      </Form>
    </div>
  )
}

export default AddChapter
