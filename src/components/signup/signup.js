
import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {Form, Button, Card, Spinner,Alert, Container } from 'react-bootstrap'
import { Link, useNavigate  } from "react-router-dom";


export default function Signup(){
    const history = useNavigate();
    const nameRef = useRef();
    const emailRef = useRef();
    const contactRef = useRef();
    const [loading, setLoading] = useState(false)
    const passwordRef = useRef();
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState({});
    const {signup} = useAuth()
    function validateForm() {
        const errors = {};
        if (!nameRef.current.value.trim()) {
            errors.name = 'Name is required';
            
        }

        if (!emailRef.current.value.includes('@')) {
            errors.email = 'Invalid email address';
            
        }

        if (passwordRef.current.value.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        }

        if(contactRef.current.value.length < 12){
            errors.contact = 'Contact must be  12 digit long';
        }

        setValidationError(errors);
        return Object.keys(errors).length === 0;
    }
    async function handleSubmit(e){
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        try {
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value , nameRef.current.value , contactRef.current.value);
            history("/login");
        } catch (error) {
            setLoading(false)
            console.log(error);
            setError("Failed to create an account");
           
        }
    }
    return(
        <>
          <Container className='d-flex align-items-center justify-content-center'
                style={{minHeight: "100vh"}}>
                <div className='w-100' style={{maxWidth: "400px"}}>
                    <Card>
                        <Card.Body>
                            <h1 className="text-center mb-4">Sign Up</h1>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" required ref={nameRef} isInvalid={!!validationError.name}></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                        {validationError.name}
                                    </Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" required ref={emailRef} isInvalid={!!validationError.email}></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                        {validationError.email}
                                    </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group id="contact">
                                <Form.Label>Contact</Form.Label>
                                <Form.Control type="text" required ref={contactRef} isInvalid={!!validationError.contact}></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                        {validationError.contact}
                                    </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" required ref={passwordRef} isInvalid={!!validationError.password}></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                        {validationError.password}
                                    </Form.Control.Feedback>
                            </Form.Group>
                            <Button type="submit" className="w-100 mt-3"> {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <div className="w-100 text-center mt-2">
                        Already have an account? <Link to="/">Log In</Link>
                    </div>
                </div>
            </Container>
        </>
    )
}

