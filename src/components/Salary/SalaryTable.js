import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../services/FirebaseCrud';
import { Form, Table } from 'react-bootstrap';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SalaryTable = () => {
  const [employees, setEmployees] = useState([]);
  const { currentUser } = useAuth()
  const [values, setValues] = useState({});


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

  const handleInputChange = useCallback((id, field, value, salary) => {
    const newValue = field === 'days' ? parseInt(value) || 0 : parseFloat(value) || 0;
    setValues(prev => ({ ...prev, [`${id}-${field}`]: newValue }));
    if (field === 'days') {
      calculateDay(id, newValue, salary);
    } else {
      calculateOvertime(id, newValue, salary);
    }
  }, []);

  const calculateDay = useCallback((id, days, salary) => {
    
    const total = parseInt((parseInt(days) || 0) * (salary / 30));
    setValues(prev => ({ ...prev, [`${id}-total`]: total }));
  }, []);

  const calculateOvertime = useCallback((id, hours, salary) => {
    const overtimeTotal = parseInt((salary / 30 / 8) * hours);
    setValues(prev => ({ ...prev, [`${id}-overtime-total`]: overtimeTotal }));
  }, []);

   const exportToExcel = () => {
    const dataToExport = employees.map(employee => ({
      Name: employee.name,
      Days: values[`${employee.id}-days`] || '',
      'Overtime Hours': values[`${employee.id}-overtime`] || '',
      Total: calculateTotal(employee.id)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'salary_data.xlsx');
  };
  const calculateTotal = (id) => {
    const dayTotal = values[`${id}-total`] || 0;
    const overtimeTotal = values[`${id}-overtime-total`] || 0;
    console.log("Overtime"+overtimeTotal + "Daytotal" + dayTotal );
    return dayTotal + overtimeTotal;
  };

  
  return (
    <div>
       <button onClick={exportToExcel} className='py-2 m-3 btn btn-primary'>Export to Excel</button>
      <Table striped bordered hover id='salary-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Days</th>
            <th>Overtime Hours</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        {employees && employees.map(employee => (
            <tr key={employee.id}>
              <td align='center' style={{ width: '10px'}}>{employee.name}</td>
              <td style={{ width: '10px'}}>
                <Form.Control type="number" style={{ width: '200px' }} 
                 onChange={(e) =>
                  handleInputChange(employee.id, 'days', e.target.value, employee.salary)
                }
                />
              </td>
              <td style={{ width: '10px'}}>
                <Form.Control type="number" style={{ width: '200px' }}
                 onChange={(e) =>
                  handleInputChange(employee.id, 'overtime', e.target.value, employee.salary)
                }
                />
              </td>
              
                <td style={{ width: '10px'}}>
                {calculateTotal(employee.id)}
                </td>
            </tr>
        ))}
        </tbody>
      </Table>
      </div>
  )
}
export default SalaryTable;