import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/style.css'; 

const API_BASE_URL = process.env.REACT_APP_API_URL;

function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'employee',
    designation: ''
  });

  const token = localStorage.getItem('access');

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployee(res.data);
    } catch (err) {
      console.error("Failed to fetch employee details:", err);
      alert('Failed to fetch employee details.');
    }
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/users/${id}/`, employee, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Employee details updated successfully!');
      navigate('/employee-list');
    } catch (err) {
      console.error("Update failed:", err);
      alert('Update failed.');
    }
  };

  return (
    <div className="container fade-in">
      <h2>Edit Employee Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block">First Name</label>
          <input
            type="text"
            name="first_name"
            value={employee.first_name}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={employee.last_name}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block">Email</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block">Designation</label>
          <input
            type="text"
            name="designation"
            value={employee.designation}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block">Password</label>
          <input
            type="password"
            name="password"
            value={employee.password}
            onChange={handleChange}
            className="input-field"
            placeholder="(Leave blank to keep existing password)"
          />
        </div>

        <button type="submit" className="orange-btn jump">
          Update Employee
        </button>
      </form>
    </div>
  );
}

export default EditEmployeePage;
