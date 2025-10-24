import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Button, Container } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { LOGOUT_MUTATION } from '../../../api/queries'
import { useAuth } from '../../../context/AuthContext'
import './Navbar.css'
import { useNotifications } from '../../../context/NotificationsContext'
import logo from '../../../assets/logo.png'


const Navigation = () => {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const isAuthenticated = !!user
  const { addNotification } = useNotifications()
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: (data) => {
      if (data) {
        navigate('/')
        setUser(null)
      }
    }
  })

  const handleLogout = async () => {
    try {
      await logout()
      addNotification('Logged out successfully',3000, 'success')
    } catch (error) {
      console.error('Error logging out:', error)
      addNotification('Something went wrong with logging out',3000, 'error')
    }
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="app-navbar" sticky="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-logo">
          <img
            src={logo}
            alt="ThePlotPot logo"
            className="brand-mark"
          />
          <span className="brand-text">
            <span className="brand-title">ThePlotPot</span>
            <span className="brand-subtitle">Stories that simmer &amp; shine</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="primary-navbar" />
        <Navbar.Collapse id="primary-navbar" className="align-items-start align-items-lg-center">
          <Nav className="main-nav me-lg-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/stories">All Stories</Nav.Link>
            {user && user.has_superpowers && (
              <Nav.Link as={Link} to="/admin/users">Manage Users</Nav.Link>
            )}
          </Nav>
          <div className="actions-wrapper">
            {isAuthenticated ? (
              <Button as={Link} to="/story" variant="warning" className="cta-button">
                Write Story
              </Button>
            ) : (
              <div className="cta-group">
                <Button as={Link} to="/signup" variant="warning" className="cta-button">
                  Join
                </Button>
                <Button as={Link} to="/login" variant="outline-light" className="cta-button-secondary">
                  Start Writing
                </Button>
              </div>
            )}
            {isAuthenticated && (
              <Nav className="auth-nav d-none d-lg-flex">
                <NavDropdown
                  title={
                    <img
                      src={`https://www.gravatar.com/avatar/${user.email}?s=80&d=robohash`}
                      className="img-fluid rounded-circle"
                      alt="User Gravatar"
                    />
                  }
                  align="end"
                  menuVariant="dark"
                >
                  <NavDropdown.Header>Hi, {user.username}</NavDropdown.Header>
                  <NavDropdown.Item as={Link} to={`/user/${user.id}`}>Dashboard</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/usersettings">Edit profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
            <Nav className="auth-nav-mobile d-lg-none">
              {isAuthenticated ? (
                <NavDropdown title={`Hi, ${user.username}`} align="end" menuVariant="dark">
                  <NavDropdown.Item as={Link} to={`/user/${user.id}`}>Dashboard</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/usersettings">Edit profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown title="Account" align="end" menuVariant="dark">
                  <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/signup">Sign Up</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
