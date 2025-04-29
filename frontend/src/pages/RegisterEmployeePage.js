import React, { useState } from 'react';
import axios from 'axios';
import '../css/style.css';
import { API_BASE_URL } from '../config'

function RegisterEmployeePage() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'Employee',
    designation: '',
  });

  const token = localStorage.getItem('access');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/users/register/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert("✅ Employee Registered!");
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'EMPLOYEE',
        designation: '',
      });
    } catch (err) {
      console.error("Registration failed", err);
      alert("❌ Registration failed. Try again.");
    }
  };

  return (
    <div className="container fade-in">
      <h2>Register New Employee</h2>
      <form onSubmit={handleSubmit} className="form-style">
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} required />       
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="text" name="role" value={formData.role} disabled />
        
        <button type="submit" className="blue-btn">Register</button>
      </form>
    </div>
  );
}

export default RegisterEmployeePage;
