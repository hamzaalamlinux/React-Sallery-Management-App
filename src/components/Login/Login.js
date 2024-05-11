import { ref } from "firebase/database";
import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {Form, Button, Card, Spinner,Alert, Container } from 'react-bootstrap'
import { Link,useNavigate } from "react-router-dom";
export default function Login(){
    const history = useNavigate();
    const emailRef = useRef();
    const [loading, setLoading] = useState(false)
    const passwordRef = useRef();
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState({});
    const {login} = useAuth()
    function validateForm() {
        const errors = {};
        if (!emailRef.current.value.includes('@')) {
            errors.email = 'Invalid email address';   
        }
        if (passwordRef.current.value.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        }
        setValidationError(errors);
        return Object.keys(errors).length === 0;
    }
    async function handleLogin(e){
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value);
            history("/dashboard")
        } catch (error) {
            setLoading(false)
            console.log(error);
            setError("Failed to Log In");
           
        }
    }
    return(
        <>
           <Container className='d-flex align-items-center justify-content-center'
                style={{minHeight: "100vh"}}>
                <div className='w-100' style={{maxWidth: "400px"}}>
                    <Card>
                        <Card.Body>
                            <h1 className="text-center mb-4">Sign In</h1>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleLogin}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" required ref={emailRef} isInvalid={!!validationError.email}></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                        {validationError.email}
                                    </Form.Control.Feedback>
                            </Form.Group>

                        

                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" required ref={passwordRef} isInvalid={!!validationError.password}></Form.Control>
                                <Form.Control.Feedback type="invalid">
                                        {validationError.password}
                                    </Form.Control.Feedback>
                            </Form.Group>
                            <Button type="submit" className="w-100 mt-3"> {loading ? <Spinner animation="border" size="sm" /> : 'Log In'}</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <div className="w-100 text-center mt-2">
                        Need an account? <Link to="/signup">Signup</Link>
                    </div>
                </div>
            </Container>
        </>
    )
}

