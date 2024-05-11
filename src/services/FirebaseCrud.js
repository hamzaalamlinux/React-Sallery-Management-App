import React from 'react'
import {app} from '../services/Firebase'
import  {getDatabase, ref, set, child, get, push, onValue, remove, update} from 'firebase/database';


const db =  getDatabase(app);
const addEmployee = async (employeeData, userId) => {
  // Basic Validation
  if (!userId) {
    throw new Error("UserID is required.");
  }
  if (!employeeData) {
    throw new Error("Employee data is required.");
  }
  // Further validation can be added here (e.g., check for required fields in employeeData)


  try {
    const employeeRef = push(ref(db, `Employees/${userId}`)); // Use push to generate a unique ID for each employee
    await set(employeeRef, employeeData);
    console.log(`Employee added successfully under ${employeeRef.key}`);
    return employeeRef.key; // Return the unique key of the added employee
  } catch (error) {
    // Error handling
    console.error("Failed to add employee:", error);
    throw new Error("Failed to add employee: " + error.message);
  }
};

// FirebaseCrud.js

// Modify the getEmployee function to retrieve multiple employees
 const getEmployees = (userId, callback) => {
  try {
    if (!userId) {
      throw new Error("UserID is required.");
    }

    const employeeRef = ref(db, `Employees/${userId}`);
    const unsubscribe = onValue(employeeRef, (snapshot) => {
      const employeesData = snapshot.val();
      const employees = Object.entries(employeesData).map(([employeeId, employeeData]) => ({
        id: employeeId,
        ...employeeData
      }));
      callback(employees);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw new Error("Failed to fetch employees: " + error.message);
  }
};

const getEmployeeById = async (userId, employeeId) => {
  if (!userId || !employeeId) {
      throw new Error("Both userID and employeeID are required.");
  }

  try {
    const employeeRef = ref(db, `Employees/${userId}/${employeeId}`);
    const snapshot = await get(employeeRef);
    if (snapshot.exists()) {
      const employeeData = snapshot.val();
      console.log("Employee data:", employeeData);
      // Add employee ID to the employee data
      employeeData.employeeId = employeeId;
      return employeeData;
    } 
    else {
      console.log("No employee found with the specified ID");
      return null; // Or you can throw an error or return a specific message
      }
  } catch (error) {
      console.error("Failed to fetch employee:", error);
      throw new Error("Failed to fetch employee: " + error.message);
  }
};

const deleteEmployee = async (userId, employeeId) => {
  console.log(userId+"  "+ employeeId)
  if (!userId || !employeeId) {
    throw new Error("Both userID and employeeID are required.");
  }
  try {
    const employeeRef = ref(db, `Employees/${userId}/${employeeId}`);
    await remove(employeeRef);
    console.log("Employee deleted successfully");
  } catch (error) {
    console.error("Failed to delete employee:", error);
    throw new Error("Failed to delete employee: " + error.message);
  }
};

const updateEmployee = async (userId, employeeId, updatedData) => {
  if (!userId || !employeeId || !updatedData) {
    throw new Error("UserID, employeeID, and updated data are required.");
  }

  try {
    const employeeRef = ref(db, `Employees/${userId}/${employeeId}`);
    await update(employeeRef, updatedData);
    console.log("Employee updated successfully");
  } catch (error) {
    console.error("Failed to update employee:", error);
    throw new Error("Failed to update employee: " + error.message);
  }
};

export { addEmployee, getEmployees, getEmployeeById, deleteEmployee, updateEmployee};
