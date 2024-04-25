
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Accordion, Form, Button, Container, Alert, Row, Col, Card, InputGroup } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { EDIT_COFFEE, CHANGE_PASSWORD } from '../../api/queries'
import { useNotifications } from '../../components/NotificationsContext'
import { useDarkMode } from '../../components/DarkModeContext'


const UserSettings = () => {
  const { isDarkMode } = useDarkMode()
  const { addNotification } = useNotifications()
  const [editCoffee] = useMutation(EDIT_COFFEE)
  const [changePassword] = useMutation(CHANGE_PASSWORD)

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      coffeeName: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string().required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
      coffeeName: Yup.string().required('Coffee name is required'),
    }),
    onSubmit: (values) => {
    },
  })

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword } = formik.values
    try{    await changePassword({
      variables: { oldPassword: currentPassword, newPassword: newPassword },
    })
    formik.setSubmitting(false)
    formik.resetForm()
    addNotification('Password changed.', 3000, 'success')
    }
    catch(error) {
      addNotification(error.message, 3000, 'error')
      console.error(error)
    }

  }

  const handleCoffeeLinkChange = async () => {
    try {
      const fullLink = `https://www.buymeacoffee.com/${formik.values.coffeeName}`
      console.log(fullLink)
      await editCoffee({ variables: { link: fullLink } })
      formik.setSubmitting(false)
      formik.resetForm()
      addNotification('Coffee link changed.', 3000, 'success')
    } catch (error) {
      addNotification(error.message, 3000, 'error')
      console.error(error)
    }
  }


  return (
    <Container>
      <Row className="justify-content-md-center mt-4">
        <Col md={6}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1" className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
              <Accordion.Header>Change Password</Accordion.Header>
              <Accordion.Body>
                <Card>
                  <Card.Body>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handlePasswordChange()
                      }}
                    >
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
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className={`${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
              <Accordion.Header>Edit your Buy Me a Coffee link</Accordion.Header>
              <Accordion.Body>
                <Card>
                  <Card.Body>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleCoffeeLinkChange()
                      }}
                    >
                      <Form.Group>
                        <Form.Label htmlFor="basic-url">Your Buy Me a Coffee URL</Form.Label>
                        <InputGroup className="mb-3">
                          <InputGroup.Text id="basic-addon3">
                            https://www.buymeacoffee.com/
                          </InputGroup.Text>
                          <Form.Control
                            id="basic-url"
                            aria-describedby="basic-addon3"
                            type="text"
                            name="coffeeName"
                            onChange={formik.handleChange}
                            value={formik.values.coffeeName}
                          />
                        </InputGroup>
                        {formik.errors.coffeeName && <Alert variant="danger" className="mt-3">{formik.errors.coffeeName}</Alert>}
                      </Form.Group>
                      <Button variant="secondary" className='mt-2' type="submit">
                        Update
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </Container>
  )
}

export default UserSettings
