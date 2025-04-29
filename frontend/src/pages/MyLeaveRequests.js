import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/style.css'; 
import '../css/MyLeaveRequests.css'; 
import { API_BASE_URL } from '../config'

function MyLeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const token = localStorage.getItem('access');

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/attendance/leave/my-leaves/?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [month, year]);

  return (
    <div className="container fade-in">
      <h2>My Leave Requests</h2>

      {/* Filters */}
      <div className="filters">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[2023, 2024, 2025].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {/* <button onClick={fetchLeaves} className="blue-btn">Filter</button> */}
      </div>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Date Applied</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="4">No leave requests for selected period.</td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.date}</td>
                <td>{leave.start_date}</td>
                <td>{leave.end_date}</td>
                <td>
                  <span className={
                    leave.status === 'APPROVED' ? 'approved' :
                    leave.status === 'REJECTED' ? 'rejected' :
                    'pending'
                  }>
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    <br></br>
    <br></br>
    <br></br>
    </div>
  );
}

export default MyLeaveRequests;
