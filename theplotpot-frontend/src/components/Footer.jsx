import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#f5f5f5', padding: '20px 0' }}>
      <Container>

        <Row>
          <Col className="text-center mt-4">
            <p>The PlotPot ©{new Date().getFullYear()} Created by Henri Vikman</p>    
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;