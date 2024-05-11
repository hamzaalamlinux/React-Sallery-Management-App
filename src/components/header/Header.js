import React from 'react'
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
export default function Header() {
  const { logout } = useAuth()
  return  (
    <>
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">Salary App</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href='/employee'>Employee</Nav.Link>
          <Nav.Link href="/salary">Salary</Nav.Link>
          {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
        </Nav>
        <Button variant="outline-light" onClick={logout}>Logout</Button>
      </Container>
    </Navbar>
  </>
  );
}
