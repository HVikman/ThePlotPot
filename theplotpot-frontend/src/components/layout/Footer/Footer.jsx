import { Container, Row, Col } from 'react-bootstrap'
import { lazy, Suspense } from 'react'
const PrivacyPolicyModal = lazy(() => import('../../modals/PrivacyPolicy'))

const Footer = () => {
  return (

    <footer style={{ padding: '20px 0', backgroundColor: '#343a40', color: '#fff', marginTop: 20 }}>
      <Container>

        <Row className="my-3">
          <Col xs={12} md={6}>
            <h5>About ThePlotPot</h5>
            <p>ThePlotPot is a collaborative story-writing platform where users contribute to ongoing stories by adding branches or chapters.</p>
          </Col>

          <Col xs={12} md={6}>
            <h5>Useful Links</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <Suspense fallback={<div>Loading...</div>}>
                <li><PrivacyPolicyModal /></li>
              </Suspense>
              <li>FAQ</li>
              <li>Help & Support</li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col className="text-center mt-4 text-light">
            <p>ThePlotPot ©{new Date().getFullYear()} Created by Henri Vikman</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
