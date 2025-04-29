import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Calendar.css'; 
import '../css/style.css'; 

function EmployeeDashboard() {
  const [user, setUser] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Jan = 1
  const [year, setYear] = useState(new Date().getFullYear());
  const [punchedIn, setPunchedIn] = useState(false);

  const token = localStorage.getItem('access');
  
  const fetchUser = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/me/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data);
  };

  const fetchAttendance = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/records/?month=${month}&year=${year}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAttendance(res.data);
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = res.data.find(d => d.date === today);
    if (todayRecord && todayRecord.punch_in && !todayRecord.punch_out) setPunchedIn(true);
  };

  useEffect(() => {
    fetchUser();
    fetchAttendance();
  }, [month, year]);

  const daysInMonth = new Date(year, month, 0).getDate();

  const getDayColor = (day) => {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = attendance.find(a => a.date === date);
    if (!record) return '';
    if (record.punch_in && record.punch_in_status === "APPROVED") return 'green';
    if (record.punch_in && !record.punch_out) return 'grey';
  };

  const handlePunch = async () => {
    const endpoint = punchedIn ? 'punch-out' : 'punch-in';
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/${endpoint}/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPunchedIn(!punchedIn);
    fetchAttendance();
  };

  const handleExportCSV = async () => {
    const exportMonth = month;
    const exportYear = year;
    const token = localStorage.getItem('access');
  
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/attendance/export/?month=${exportMonth}&year=${exportYear}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        alert("Failed to export attendance.");
        console.log(res.status);
        return;
      }
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed.");
    }
  };

  return (
    <div className="container fade-in">
      <h2>Hello, {user.first_name} {user.last_name}</h2>

      <div className="filters">
        <label>Month: </label>
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          {[...Array(12).keys()].map(m => (
            <option key={m+1} value={m+1}>{new Date(0, m).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <label>Year: </label>
        <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} />
      </div>
      <div className="calendar">
        {[...Array(daysInMonth).keys()].map(day => (
          <div key={day+1} className={`day ${getDayColor(day+1)}`}>
            {day + 1}
          </div>
        ))}
      </div>

      <button className="orange-btn" onClick={() => window.location.href='/punch'}>
        Punch In/Out for Today
      </button>

      <div className="buttons">
        <button className="blue-btn" onClick={() => window.location.href='/apply-leave'}>Apply for Leave</button>
        <button onClick={() => window.location.href = '/my-leaves'} className="blue-btn mt-4"> View Leave Requests</button>
        <button className="blue-btn" onClick={handleExportCSV}>Export CSV</button>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
