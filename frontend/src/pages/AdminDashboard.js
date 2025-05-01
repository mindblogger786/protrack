import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/style.css';
import '../css/Calendar.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function AdminDashboard() {
  const [user, setUser] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [punchedIn, setPunchedIn] = useState(false);

  const token = localStorage.getItem('access');

  // Fetch user and check role
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);

      // 🛡️ Role check
      if (res.data.role === 'EMPLOYEE') {
        alert('Access denied. Redirecting to Employee Dashboard...');
        window.location.href = '/employee-dashboard';
      }

    } catch (error) {
      console.error('Error fetching user:', error);
      window.location.href = '/login';
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/attendance/records/?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendance(res.data);

      const today = new Date().toISOString().split('T')[0];
      const todayRecord = res.data.find(d => d.date === today);
      if (todayRecord && todayRecord.punch_in && !todayRecord.punch_out) {
        setPunchedIn(true);
      }
    } catch (err) {
      console.error("Error fetching attendance", err);
    }
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
    if (!record.punch_in && !record.punch_out) return 'grey';
  };

  return (
    <div className="container fade-in">
      <h2>Hello, {user.first_name} {user.last_name} (Admin)</h2>

      <div className="filters">
        <label>Month: </label>
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          {[...Array(12).keys()].map(m => (
            <option key={m+1} value={m+1}>
              {new Date(0, m).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <label>Year: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        />
      </div>

      <div className="calendar">
        {[...Array(daysInMonth).keys()].map(day => (
          <div key={day+1} className={`day ${getDayColor(day+1)}`}>
            {day + 1}
          </div>
        ))}
      </div>
  
      <div className="buttons">
        <button className="orange-btn" onClick={() => window.location.href = '/punch'}>
          Admin Punch In/Out
        </button>
      </div>

      <div className="buttons">
        <button className="blue-btn" onClick={() => window.location.href = '/attendance-requests'}>
          Attendance Requests
        </button>
        <button className="blue-btn" onClick={() => window.location.href = '/employee-list'}>
          Employee List
        </button>
        <button className="blue-btn" onClick={() => window.location.href = '/register'}>
          Register New Employee
        </button>
        <button className="blue-btn" onClick={() => window.location.href = '/export-attendance'}>
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
