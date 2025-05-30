import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/style.css';
import '../css/AdminAttendanceRequests.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function AdminAttendanceRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('access');

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/attendance/admin/attendance-requests/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch attendance requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, target, action) => {
    await axios.patch(`${API_BASE_URL}/api/attendance/admin/attendance-requests/${id}/update/`, {
      action: action,
      target: target
    }, {
      headers: { Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json' }
    });

    fetchRequests();
  };

  return (
    <div className="container fade-in">
      <h2>Attendance Requests</h2>

      <table className="custom-table">
        <thead>
          <tr className='table-heading'>
            <th>Employee</th>
            <th>Date</th>
            <th>Punch In</th>
            <th>Punch In Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.user_name}</td>
              <td>{req.date}</td>
              <td>{req.punch_in || '-'}</td>
              <td>{req.punch_in_status}</td>
              <td>
                {req.punch_in_status === 'pending' && (
                  <>
                    <button className='buttn green-btn' onClick={() => handleAction(req.id, 'punch_in', 'approve')}>✔ Approve In</button>
                    <button className='buttn red-btn' onClick={() => handleAction(req.id, 'punch_in', 'reject')}>✖ Reject In</button>
                  </>
                )}
              </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAttendanceRequests;
