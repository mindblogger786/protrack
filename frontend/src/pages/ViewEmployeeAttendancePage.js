import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/EmployeeListPage.css';
import '../css/ViewEmployeeAttendance.css';
import { API_BASE_URL } from '../config'

function ViewEmployeeAttendancePage() {
  const { employeeId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const token = localStorage.getItem('access');

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/attendance/user/${employeeId}/?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(res.data);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const handleAction = async (attendanceId, action) => {
    try {
      await axios.post(`${API_BASE_URL}/api/attendance/update/${attendanceId}/`, 
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Attendance updated!");
      fetchAttendance(); // refresh after updating
    } catch (err) {
      console.error("Update failed", err);
      alert("❌ Update failed. Try again.");
    }
  };

  return (
    <div className="container fade-in">
      <h2>Employee Attendance History</h2>

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
        <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} />
      </div>

      <table className="styled-table">
        <thead>
          <tr className='table-heading'>
            <th>Date</th>
            <th>Punch In</th>
            <th>Punch Out</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {attendance.length > 0 ? ( attendance.map(record => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{record.punch_in || 'N/A'}</td>
              <td>{record.punch_out || 'N/A'}</td>
              <td>{record.location || 'N/A'}</td>
              <td className='action-buttons'>
                <div>
                  <button className="small-btn green" onClick={() => handleAction(record.id, 'present')}>Present</button>
                  <button className="small-btn red" onClick={() => handleAction(record.id, 'absent')}>Absent</button>
                </div>
                <div>
                  <button className="small-btn blue" onClick={() => handleAction(record.id, 'half-day')}>Half Day</button>
                  <button className="small-btn orange" onClick={() => handleAction(record.id, 'leave')}>Leave</button>
                </div>
              </td>
            </tr>
          ))
        ) : (
            <tr>
              <td colSpan="7">No attendance found.</td>
            </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewEmployeeAttendancePage;
