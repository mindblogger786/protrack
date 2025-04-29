# ProTrack – Employee Attendance Tracking System

ProTrack is a full-stack web application for tracking employee attendance, applying leaves, and managing administrative tasks.

---

## ✨ Features

### Employee:
- Punch In / Punch Out with live webcam capture 📸
- Capture location at the time of punch-in/out 📍
- Attendance Calendar View (Present, Absent, Half Day)
- Apply for Leaves (Sick, Casual, Paid)
- View Leave Applications and Status
- Export Personal Attendance as CSV

### Admin:
- Admin Dashboard with Calendar View
- Approve/Reject Punch-In/Punch-Out Requests
- View Employee List
- View Attendance History by Month and Year
- Edit Employee Details
- Edit Attendance Records (Mark Present, Absent, Half-Day, Leave)
- Register New Employees
- Export Attendance CSV Reports (by Employee, Month, Year)
- Authentication Redirects based on Role
- Employees cannot access Admin Dashboard

---

## 🛠️ Technologies Used

- Frontend: React.js
- Backend: Django REST Framework
- Database: PostgreSQL
- Authentication: JWT (SimpleJWT)
- Libraries: Axios, Webcam.js, OpenStreetMap API

---

## 📂 Project Structure
```bash
protrack/
│
├── backend/
│   ├── attendance/
│   ├── users/
│   ├── manage.py
│   └── settings.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── README.md
└── requirements.txt
```
---

## 🚀 Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mindblogger786/protrack.git
cd protrack
```
---

## 📜 License
- This project is made for academic and learning purposes. 🚀
