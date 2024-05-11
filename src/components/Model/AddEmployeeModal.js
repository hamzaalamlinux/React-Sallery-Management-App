import React, { useRef } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { addEmployee } from '../../services/FirebaseCrud';
import { useAuth } from '../../context/AuthContext';
import { Alert, Spinner } from 'react-bootstrap';
export default function AddEmployeeModal() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false)
    const nameRef = useRef();
    const contactRef = useRef();
    const cnicRef = useRef();
    const [error, setError] = useState('');
    const salaryRef = useRef();
    const { currentUser } = useAuth();

    const saveEmployee = async () => {
        try {
          
            const uid = currentUser ? currentUser.uid : null;
            const name = nameRef.current.value;
            const contact = contactRef.current.value;
            const cnic = cnicRef.current.value;
            const salary = salaryRef.current.value;
            const employeeData = { name, contact, cnic, salary }; // Assuming you have these state variables
            setLoading(true)
            await addEmployee(employeeData, uid);
            handleClose(); // Close the modal
            setLoading(false)
            // Optionally reset form fields here
        } catch (error) {
            setLoading(false)
            console.error( error);
            setError("Failed to save employee");
        }
    };
  return (
    <>
    <Button variant="primary" className='m-4' onClick={handleShow}>
        Add Employee
     </Button>
      <Modal show={show} onHide={handleClose} key={show}>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
          {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                autoFocus
                ref={nameRef}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Contact"
                ref={contactRef}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>CNIC</Form.Label>
              <Form.Control
                type="text"
                placeholder="CNIC"
                ref={cnicRef}
                
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="text"
                placeholder="Salary"
                ref={salaryRef}
                
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveEmployee}>
            {loading ? <Spinner animation="border" size="sm" /> : ' Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
