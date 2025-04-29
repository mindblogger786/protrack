import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/EmployeeListPage.css';
import '../css/style.css';
import { API_BASE_URL } from '../config'

function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem('access');

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      alert('Failed to load employees.');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleViewAttendance = (empId) => {
    window.location.href = `/view-attendance/${empId}`;
  };

  const handleEditEmployee = (userId) => {
    window.location.href = `/edit-employee/${userId}`;
  };

  return (
    <div className="container fade-in">
      <h2>Employee List</h2>
      <table className="styled-table">
        <thead>
          <tr className='table-heading'>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.username}</td>
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td>{emp.email}</td>
                <td>{emp.designation}</td>
                <td>
                  <button className="btn blue-btn" onClick={() => handleViewAttendance(emp.id)}>View Attendance</button>
                  <br />
                  <br />
                  <button className="btn orange-btn" onClick={() => handleEditEmployee(emp.id)}>Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeListPage;
