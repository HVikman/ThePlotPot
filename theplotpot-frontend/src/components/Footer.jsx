import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer style={{ padding: '20px 0', backgroundColor: '#343a40', color: '#fff', marginTop: 20 }}>
      <Container>

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
