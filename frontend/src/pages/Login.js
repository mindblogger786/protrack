import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserInfo } from '../utils/auth';
import '../css/style.css';
import { API_BASE_URL } from '../config'


function Login() {
  // const user = getUserInfo();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const form = document.querySelector('.login-form');
    form.classList.add('fade-in');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/users/login/`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const access = res.data.access;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', res.data.refresh);

      const userRes = await axios.get(`${API_BASE_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      
      const user = userRes.data;

      if (user.role === 'ADMIN') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err) {
      console.error("❌ Login failed:", err);
      alert("Invalid credentials or server error.");
    }
  };

  return (
    <div className="login-form">
      <h2>Login to ProTrack</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="login-links">
        <a href="/forgot-password">Forgot Password?</a>
      </div>
      <button className="login-btn" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
