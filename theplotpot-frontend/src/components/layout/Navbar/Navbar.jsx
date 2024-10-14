import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { LOGOUT_MUTATION } from '../../../api/queries'
import { useAuth } from '../../../context/AuthContext'
import './Navbar.css'
import { useNotifications } from '../../../context/NotificationsContext'


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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/stories">All Stories</Nav.Link>
          {isAuthenticated && <Nav.Link as={Link} to="/story">Create a new story</Nav.Link>}
          {user && user.has_superpowers && (
            <Nav.Link as={Link} to="/admin/users">Manage Users</Nav.Link>
          )}
        </Nav>

        <Nav className="d-none d-lg-flex">  {/* Hide on small, show on large screens */}
          {isAuthenticated ? (
            <NavDropdown title={
              <img
                src={`https://www.gravatar.com/avatar/${user.email}?s=80&d=robohash`}
                className="img-fluid rounded-circle"
                alt="User Gravatar"
              />} align='end'>
              <NavDropdown.Item className="no-hover-effect">Hi, {user.username}</NavDropdown.Item>
              <NavDropdown.Item as={Link} to={`/user/${user.id}`}>Dashboard</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/usersettings">Edit profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Button variant="outline-light" as={Link} to="/login">Login</Button>
              <Button variant="outline-light" as={Link} to="/signup" className="ml-2">Signup</Button>
            </>
          )}
        </Nav>

        {/* Mobile-specific menu */}
        {isAuthenticated ?
          <Nav className="d-lg-none">
            <NavDropdown title={`Hi, ${user.username}`} align='end'>
              <NavDropdown.Item as={Link} to={`/user/${user.id}`}>Dashboard</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/usersettings">Edit profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          :
          <Nav className="d-lg-none">
            <NavDropdown title={'Login/Signup'} align='end'>
              <NavDropdown.Item as={Link} to='/login'>Login</NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/signup'>Signup</NavDropdown.Item>
            </NavDropdown>
          </Nav>}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
