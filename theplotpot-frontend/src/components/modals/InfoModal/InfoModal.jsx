import React, { useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

const InfoModal = () => {
  const [show, setShow] = useState(true)


  return (
    <ToastContainer position="top-end" className="p-3" style={{ position: 'fixed' }}>
      <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide>
        <Toast.Header>
          <strong className="me-auto">Welcome to ThePlotPot</strong>
        </Toast.Header>
        <Toast.Body>Hey, did you know you can log in to create stories and collaborate on stories created by others? Join our community to unleash your creativity!</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default InfoModal