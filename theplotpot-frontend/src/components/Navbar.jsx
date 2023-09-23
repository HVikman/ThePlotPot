import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Gravatar from 'react-gravatar'
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { LOGOUT_MUTATION } from '../api/queries'
import { useAuth } from '../pages/auth/AuthContext'
import './Navbar.css'
import { useNotifications } from '../components/NotificationsContext'


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
    <Navbar bg="dark" variant="dark" expand="lg" style={{ height:'80px' }}>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/stories">All Stories</Nav.Link>
          {isAuthenticated ? <Nav.Link as={Link} to="/story">Create a new story</Nav.Link> : <></>}
        </Nav>

        <Nav >
          {isAuthenticated ? (
            <>
              <NavDropdown  title={<Gravatar style={{ borderRadius: 25, width: '70%',height: '70%' }} md5={user.email}/>} align='end'>
                <NavDropdown.Item className="no-hover-effect">Hi, {user.username}</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/usersettings">Edit profile</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <>
              <Button variant="outline-light" as={Link} to="/login">Login</Button>
              <Button variant="outline-light" as={Link} to="/signup" className="ml-2">Signup</Button>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
