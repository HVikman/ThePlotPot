import React from 'react'
import { Collapse } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Form, Button, Container, Alert, Row, Col, Card } from 'react-bootstrap'

const { Panel } = Collapse

const UserSettings = () => {
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      websiteLink: ''
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string().required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
      websiteLink: Yup.string()
        .matches(
          /^https:\/\/www\.buymeacoffee\.com\//,
          'Must be a buymeacoffee link'
        )
        .required('Website link is required')
    }),
    onSubmit: (values) => {

    }
  })

  return (
    <Container>
      <Row className="justify-content-md-center mt-4">
        <Col md={6}>
          <Collapse accordion>
            <Panel header="Change Password" key="1">
              <Card>
                <Card.Body>
                  <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className='mt-2'>
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        onChange={formik.handleChange}
                        value={formik.values.currentPassword}
                      />
                    </Form.Group>
                    <Form.Group className='mt-2'>
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        onChange={formik.handleChange}
                        value={formik.values.newPassword}
                      />
                    </Form.Group>
                    <Form.Group className='mt-2'>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                      />
                    </Form.Group>
                    <Button variant="secondary" className='mt-2' type="submit">
                      Update Password
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Panel>
            <Panel header="Edit your Buy Me a Coffee link" key="2">
              <Card>
                <Card.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Buy Me a Coffee link</Form.Label>
                      <Form.Control
                        type="text"
                        name="websiteLink"
                        onChange={formik.handleChange}
                        value={formik.values.websiteLink}
                      />
                      {formik.errors.websiteLink && <Alert variant="danger" className="mt-3">{formik.errors.websiteLink}</Alert>}
                    </Form.Group>
                    <Button variant="secondary" className='mt-2' type="submit">
                      Update
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </Container>
  )
}

export default UserSettings
