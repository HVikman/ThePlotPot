import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import './privacypolicy.css'

const PrivacyPolicyModal = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button
        variant="link"
        onClick={handleShow}
        style={{ color: 'inherit', textDecoration: 'underline', padding: 0, background: 'none', border: 'none' }}
      >
  Privacy Policy
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg" >
        <Modal.Header closeButton className='content'>
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body className='content'>
          <div >
            <h4>Last Updated: 28.10.2023</h4>
            <h3>Welcome to ThePlotPot</h3>
            <p>This Privacy Policy is designed to inform you about how we handle your personal information.</p>

            <h4>Information We Collect</h4>

            <h5>Information you provide us:</h5>
            <ul>
              <li><strong>Username:</strong> Used to identify you on our platform.</li>
              <li><strong>Email Address:</strong> For communication purposes and account recovery.</li>
              <li><strong>Password:</strong> Encrypted and stored securely to protect your account.</li>
            </ul>

            <h5>Content you generate:</h5>
            <ul>
              <li><strong>Comments, Stories, and Chapters:</strong> These are stored and associated with your account. If deleted, we archive them for a specific period for recovery purposes or to comply with our obligations.</li>
            </ul>

            <h5>Information from usage of our services:</h5>
            <p>We may gather data about how you interact with our services, such as frequency, duration, and which features you use most often.</p>

            <h5>Cookies</h5>
            <p>We use cookies exclusively for session-based authentication. This ensures that users remain signed in while navigating the site. We don’t use cookies for tracking, advertising, or any other purposes.</p>

            <h4>How We Use the Information We Collect</h4>
            <ul>
              <li><strong>Personalizing Your Experience:</strong> Your information helps us respond to your individual needs.</li>
              <li><strong>Improving Our Website:</strong> We continuously strive to improve our website offerings based on the information and feedback we receive from you.</li>
              <li><strong>Sending Periodic Emails:</strong> The email address you provide may be used to send you information and updates related to your account, in addition to occasional company news, updates, or related product/service information, etc.</li>
            </ul>

            <h4>Your Choices</h4>
            <ul>
              <li><strong>Modifying or Deleting Your Personal Information:</strong> You can modify or delete your personal information at any time by logging into your account and accessing the settings page.</li>
            </ul>

            <h4>Changes to This Privacy Policy</h4>
            <p>We may change this Privacy Policy from time to time. If we make any changes, we will notify you by revising the &quot;Last Updated&quot; date at the top of this Privacy Policy.</p>
          </div>

        </Modal.Body>
        <Modal.Footer className='content'>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PrivacyPolicyModal