import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/style.css';
import '../css/ExportAttendancePage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function ExportAttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const token = localStorage.getItem('access');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleExport = async () => {
    if (!employeeId) {
      alert('Please select an employee.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/attendance/admin/export-attendance/?month=${month}&year=${year}&employee_id=${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        alert('Failed to export attendance.');
        return;
      }
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${employeeId}_${month}_${year}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="container fade-in">
      <h2>Export Attendance</h2>

      <div className="filters export-filters">
        <label>Employee: </label>
        <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.first_name} {emp.last_name}
            </option>
          ))}
        </select>
          <br></br>
          <br></br>
        <label>Month: </label>
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          {[...Array(12).keys()].map(m => (
            <option key={m+1} value={m+1}>
              {new Date(0, m).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
          <br></br>
          <br></br>
        <label>Year: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        />

          <br></br>
          <br></br>
        <button className="orange-btn" onClick={handleExport}>Download CSV</button>
      </div>
    </div>
  );
}

export default ExportAttendancePage;
