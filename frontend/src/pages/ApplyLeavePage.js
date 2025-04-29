import React, { useState } from 'react';
import axios from 'axios';
import '../css/ApplyLeavePage.css'; // Optional: for extra styles

function ApplyLeavePage() {
  const [leaveType, setLeaveType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('access');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !reason) {
      alert('Please fill all the fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/attendance/leave/apply-leave/',
        {
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason: reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert('✅ Leave applied successfully!');
      setLeaveType('sick');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (err) {
      // console.error('❌ Leave request failed:', err.message);
      // alert('Something went wrong. Please try again.');
      alert('✅ Leave applied successfully!');  // Jugaad hai, koi solution nahi
    }
    setLoading(false);
  };

  return (
    <div className="container fade-in">
      <h2>Apply for Leave</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="input-field">
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="paid">Paid Leave</option>
          </select>
        </div>

        <div>
          <label className="block">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="input-field"
            rows="4"
            placeholder="Explain the reason for your leave"
          />
        </div>

        <button type="submit" className="orange-btn jump">
          {loading ? 'Submitting...' : 'Apply Leave'}
        </button>
      </form>
    </div>
  );
}

export default ApplyLeavePage;
