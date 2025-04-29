import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';

function PunchPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [location, setLocation] = useState('Getting location...');
  const [punchedIn, setPunchedIn] = useState(false);
  const token = localStorage.getItem('access');
  const webcamRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString());
  
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
  
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const data = await response.json();
  
          // 🗺️ Get full detailed address
          const fullAddress = data.display_name;
          setLocation(`${fullAddress} | ${lat}, ${lon}` );
        } catch (err) {
          console.error("Failed to get detailed location:", err);
          setLocation(`${lat}, ${lon}`);
        }
      },
      (err) => {
        console.error("Geolocation error", err);
        setLocation("Unable to fetch location");
      }
    );
  
    checkTodayPunchStatus();
  }, []);

  const checkTodayPunchStatus = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/attendance/records/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const today = new Date().toISOString().split('T')[0];
      const todayRecord = res.data.find(r => r.date === today);

      if (todayRecord?.punch_in && todayRecord?.punch_in_status === "APPROVED") {
        setPunchedIn(true);
      }
    } catch (err) {
      console.error("Punch status check failed", err);
    }
  };

  const handlePunch = async () => {
    const image = webcamRef.current.getScreenshot();
    const token = localStorage.getItem('access');
    // console.log("📸 Captured Image (Base64):", image);

    if (!image) {
      alert("Webcam image not captured. Please allow camera access.");
      return;
    }
    
    const endpoint = punchedIn ? 'punch-out' : 'punch-in';
  
    try {
      await axios.post(`http://127.0.0.1:8000/api/attendance/${endpoint}/`, {
        photo: image,
        location: location
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      alert(`Successfully ${punchedIn ? 'punched out' : 'punched in'}!`);
      setPunchedIn(!punchedIn);
      
      const userRes = await axios.get('http://127.0.0.1:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const role = userRes.data.role;
      if (role !== 'EMPLOYEE') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err) {
      console.error(err);
      alert('Punch failed!');
    }
  };

  return (
    <div className="container fade-in webcam">
      
      <div>
        <h2>{punchedIn ? 'Punch Out' : 'Punch In'}</h2>
        <p><strong>Time:</strong> {currentTime}</p>
        <p><strong>Location:</strong> {location}</p>

        <button className="orange-btn" onClick={handlePunch}>
          {punchedIn ? 'Punch Out Now' : 'Punch In Now'}
        </button>
      </div>
      <div>
        <Webcam
          audio={false}
          height={320}
          screenshotFormat="image/jpeg"
          width={420}
          ref={webcamRef}
          mirrored={true}
          videoConstraints={{
            width: 320,
            height: 240,
            facingMode: 'user'
          }}
        />
      </div>
      
      
    </div>
  );
}

export default PunchPage;
