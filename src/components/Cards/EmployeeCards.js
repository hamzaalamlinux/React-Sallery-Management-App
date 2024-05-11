import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Row } from 'react-bootstrap';
import men from '../../assets/images/man.png';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, getEmployeeById, deleteEmployee, updateEmployee } from '../../services/FirebaseCrud';
import ViewModal from '../Model/ViewModal';
import { Alert, Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { CiEdit } from "react-icons/ci";


export default function EmployeeCards() {
  const [error, setError] = useState('');  
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([]);
  const [singleEmployee, setsingleEmployee] = useState([]);


  const [editModalshow, ediModalsetShow] = useState(false);
  const handleEditClose = () => ediModalsetShow(false);


  const handleEditShow = (employee) => {
    ediModalsetShow(true);
    setsingleEmployee(employee);
  }
  

    const updateNameRef = useRef();
    const updateContactRef = useRef();
    const updateCnicRef = useRef();
    const updateSalaryRef = useRef();

  const { currentUser } = useAuth();
  const [Viewshow, setViewShow] = useState(false);
  const handleViewClose = () => setViewShow(false);
  const handleViewShow = async (id) => {
    const userId = currentUser ? currentUser.uid : null;
    if (!userId) {
      console.log("User ID not found");
      return;
    }

    try {
      const employee = await getEmployeeById(userId, id);
      setsingleEmployee(employee);
      setViewShow(true);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    }
  }

  const deleteEmployeeById = async (id) => {
    try {
      // Your code to delete an employee
      // Example:
      const userId = currentUser ? currentUser.uid : null;
      
      await deleteEmployee(userId, id);

      // Remove the deleted employee from the employees state
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
      
      // Close the view modal if the deleted employee is currently being viewed
      if (singleEmployee && singleEmployee.id === id) {
        setsingleEmployee(null);
        setViewShow(false);
      }
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };
  const updateEmployees = async (employeeId) => {
    try {
        const employeId = employeeId;
        const uid = currentUser ? currentUser.uid : null;
        const name = updateNameRef.current.value;
        const contact = updateContactRef.current.value;
        const cnic = updateCnicRef.current.value;
        const salary = updateSalaryRef.current.value;
        const  updatedData = { name, contact, cnic, salary }; // Assuming you have these state variables
        setLoading(true)
        await updateEmployee(uid, employeId, updatedData);
     
        handleEditClose()
        setLoading(false)
        // Optionally reset form fields here
    } catch (error) {
        setLoading(false)
        console.error( error);
        setError("Failed to save employee");
    }
};

  useEffect(() => {
    const userId = currentUser ? currentUser.uid : null;
    if (!userId) return;

    const unsubscribe = getEmployees(userId, (employees) => {
      setEmployees(employees);
    });
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <div className='container'>
         {/* Edit Modal  */}
        <Modal show={editModalshow} onHide={handleEditClose} key={editModalshow}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
          {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Header>
        <Modal.Body>
        {singleEmployee && (
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                defaultValue={singleEmployee.name}
                ref={updateNameRef}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Contact"
                defaultValue={singleEmployee.contact}
                ref={updateContactRef}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>CNIC</Form.Label>
              <Form.Control
                type="text"
                placeholder="CNIC"
                defaultValue={singleEmployee.cnic}
                ref={updateCnicRef}
                
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="text"
                placeholder="Salary"
                defaultValue={singleEmployee.salary}
                ref={updateSalaryRef}
                
              />
            </Form.Group>
          </Form>
           )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => updateEmployees(singleEmployee.id)}>
            {loading ? <Spinner animation="border" size="sm" /> : ' Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
        <Modal show={Viewshow} onHide={handleViewClose} key={Viewshow}>
  
        <Modal.Header closeButton>
          <Modal.Title>Employee Info</Modal.Title>
          {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Header>
        <Modal.Body>
        {singleEmployee ? (
          <div>
            <div className="mb-3">
              <strong>Name:</strong>
              <span className="ms-2">{singleEmployee.name}</span>
            </div>
            <div className="mb-3">
              <strong>Contact:</strong>
              <span className="ms-2">{singleEmployee.contact}</span>
            </div>
            <div className="mb-3">
              <strong>CNIC:</strong>
              <span className="ms-2">{singleEmployee.cnic}</span>
            </div>
           
          </div>
        ) : (
          <p>{error || "No employee data available."}</p>
        )}
      </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={()=> deleteEmployeeById(singleEmployee.employeeId)} style={{ display: 'block', margin: 'auto' }}>Delete</Button>
          {/* <Button variant="primary" onClick={saveEmployee}>
            {loading ? <Spinner animation="border" size="sm" /> : ' Save Changes'}
          </Button> */}
        </Modal.Footer>
      </Modal>
      <Row xs={1} md={2} lg={3} className='g-4'>
        {employees.map(employee => (
          <div key={employee.id}>
            <Card style={{ width: '18rem', margin: '10px' }}>
            <CiEdit style={{ marginLeft: 'auto', cursor:"pointer"}} onClick={() => handleEditShow(employee)} />

              <Card.Img
                variant="top"
                src={men}
                style={{ height: 'auto', width: '50%', objectFit: 'cover', maxWidth: '100%', margin: 'auto' }}
              />
              <Card.Body>
                <hr></hr>
                <Card.Text style={{ textAlign: 'center', fontSize: '18px', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Name: {employee.name}</p>
                  <p style={{ marginBottom: '10px' }}>Salary: {employee.salary} Rs </p>
                </Card.Text>
                <Button variant="primary" style={{ display: 'block', margin: 'auto' }}     onClick={() => handleViewShow(employee.id)}>View</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Row>
    </div>
  );
}
