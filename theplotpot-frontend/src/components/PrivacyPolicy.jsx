import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import './privacypolicy.css'
import '../utils/theme.css'
import { useDarkMode } from './DarkModeContext'

const PrivacyPolicyModal = () => {
  const { isDarkMode } = useDarkMode()
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

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Modal.Header closeButton className={`content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <div >
            <h4>Last Updated: 06.11.2023</h4>
            <h3>Welcome to ThePlotPot</h3>
            <p>This Privacy Policy is designed to inform you about how we handle your personal information.</p>

            <h4>Information We Collect</h4>

            <h5>Information you provide us:</h5>
            <ul>
              <li><strong>Username:</strong> Used to identify you on our platform.</li>
              <li><strong>Email Address:</strong> For communication purposes and account recovery.</li>
              <li><strong>Password:</strong> Encrypted and stored securely to protect your account.</li>
            </ul>
            <h5>Information Collected Automatically:</h5>
            <ul>
              <li><strong>IP Address:</strong> We collect your IP address to help diagnose problems with our server, to administer our website more effectively, and to gather broad demographic information. Your IP address is also used for security purposes, such as combating fraud and managing access rights.</li>
            </ul>

            <h5>Anti-Spam Measures</h5>
            <ul>
              <li><strong>Google reCAPTCHA:</strong> We implement reCAPTCHA v3 to prevent spam and abuse of our services. reCAPTCHA analyzes your interactions to differentiate between human users and bots without requiring explicit user interaction. Google may collect hardware and software information, such as device and application data, and send that data to Google for analysis. For more information, please visit <a href="https://policies.google.com/privacy">Google&apos;s Privacy Policy</a>.</li>
              <li><strong>Akismet:</strong> We use Akismet to filter out spam from comments and stories submitted by users. When comments or stories are submitted, certain information about the user, such as username, email address, IP address, user agent, and the content itself may be sent to Akismet for analysis and spam detection. For more information, please visit <a href="https://akismet.com/privacy/">Akismet&apos;s Privacy Policy</a>.</li>
            </ul>
            <h5>Content you generate:</h5>
            <ul>
              <li><strong>Comments, Stories, and Chapters:</strong> These are stored and associated with your account. If deleted, we archive them for a specific period for recovery purposes or to comply with our obligations.</li>
            </ul>

            <h5>Information from usage of our services:</h5>
            <p>We may gather data about how you interact with our services, such as frequency, duration, and which features you use most often.</p>

            <h5>Cookies</h5>
            <p>We use cookies exclusively for session-based authentication. This ensures that users remain signed in while navigating the site. We don’t use cookies for tracking, advertising, or any other purposes.</p>

            <h5>How We Use the Information We Collect</h5>
            <ul>
              <li><strong>Personalizing Your Experience:</strong> Your information helps us respond to your individual needs.</li>
              <li><strong>Improving Our Website:</strong> We continuously strive to improve our website offerings based on the information and feedback we receive from you.</li>
              <li><strong>Sending Periodic Emails:</strong> The email address you provide may be used to send you information and updates related to your account, in addition to occasional company news, updates, or related product/service information, etc.</li>
            </ul>

            <h5>Your Choices</h5>
            <ul>
              <li><strong>Modifying or Deleting Your Personal Information:</strong> You can modify or delete your personal information at any time by logging into your account and accessing the settings page.</li>
            </ul>

            <h5>Third-Party Services</h5>
            <p>We utilize third-party services to maintain the integrity of our site, which includes Google reCAPTCHA for spam prevention and Akismet for spam detection in comments and stories. The use of these services is subject to their respective privacy policies. We do not control these third parties </p>

            <h5>Changes to This Privacy Policy</h5>
            <p>We may change this Privacy Policy from time to time. If we make any changes, we will notify you by revising the &quot;Last Updated&quot; date at the top of this Privacy Policy.</p>
          </div>

        </Modal.Body>
        <Modal.Footer className={`content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PrivacyPolicyModal