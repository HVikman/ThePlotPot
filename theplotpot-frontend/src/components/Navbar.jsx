import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Gravatar from 'react-gravatar';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGOUT_MUTATION } from '../api/queries';
import { useAuth } from '../pages/auth/AuthContext';
import './Navbar.css'

const Navigation = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const isAuthenticated = !!user;

    const [logout] = useMutation(LOGOUT_MUTATION, {
        onCompleted: (data) => {
            if (data) {
                navigate('/');
                setUser(null);
            }
        }
    });

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/story">Create a new story</Nav.Link>
                </Nav>
                
                <Nav>
                    {isAuthenticated ? (
                        <>
                            <NavDropdown title={<Gravatar md5={user.email}/>} id="user-dropdown" >
                                <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </>
                    ) : (
                        <>
                            <Button variant="outline-primary" as={Link} to="/login">Login</Button>
                            <Button variant="outline-secondary" as={Link} to="/signup" className="ml-2">Signup</Button>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
