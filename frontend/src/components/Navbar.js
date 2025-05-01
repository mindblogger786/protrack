import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const access = localStorage.getItem('access');

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    const token = localStorage.getItem('access');
    setIsLoggedIn(!!token);

    const fetchRole = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/users/me/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setUserRole(data.role);
        } catch (err) {
          console.error('Failed to fetch role:', err);
          setUserRole(null);
        }
      }
    };

    fetchRole();
  }, [darkMode]);

  const handleLogoClick = () => {
    if (userRole === 'ADMIN') {
      navigate('/admin-dashboard');
    } else if (userRole === 'EMPLOYEE') {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navigatetodashboard = async () => {
    try {
      const userRes = await axios.get(`${API_BASE_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      
      const role = userRes.data.role;
      if (role !== 'EMPLOYEE') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <h1>ProTrack</h1>
        <span className="slogan">Track time, manage smart</span>
      </div>
      <div className="nav-right">
        <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">
          {darkMode ? '🌞' : '🌙'}
        </button>
        {isLoggedIn && (
          <button onClick={handleLogout} className="nav-btn">Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
