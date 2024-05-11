import { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { getEmployees } from '../../services/FirebaseCrud'; // Import the function to fetch employees
import { useAuth } from '../../context/AuthContext';

const EmployeeCount = () => {
  const [employeeCount, setEmployeeCount] = useState(null); // State to store the employee count
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const userId = currentUser ? currentUser.uid : null;
    if (!userId) return;
    
    const unsubscribe = getEmployees(userId, (employees) => {
      setEmployeeCount(employees.length);
    });
    
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <Card style={{ width: '18rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Card.Body style={{ backgroundColor: '#f8f9fa', textAlign: 'center' }}>
        <Card.Title style={{ color: '#343a40', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Employees</Card.Title>
        <Card.Text style={{ color: '#6c757d', fontSize: '1.2rem', marginBottom: '1rem' }}>
          {employeeCount !== null ? (
            employeeCount !== 'Error' ? (
              <p>Total employees: {employeeCount}</p>
            ) : (
              <p>Error fetching employee count</p>
            )
          ) : (
            <p>Loading employee count...</p>
          )}
        </Card.Text>
       
      </Card.Body>
    </Card>
  </div>
  );
};

export default EmployeeCount;
