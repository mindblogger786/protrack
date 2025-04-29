import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PunchPage from './pages/PunchPage';
import ApplyLeavePage from './pages/ApplyLeavePage';
import MyLeaveRequests from './pages/MyLeaveRequests';
import AdminAttendanceRequests from './pages/AdminAttendanceRequests';
import EmployeeListPage from './pages/EmployeeListPage';
import EditEmployeePage from './pages/EditEmployeePage';
import ViewEmployeeAttendancePage from './pages/ViewEmployeeAttendancePage';
import RegisterEmployeePage from './pages/RegisterEmployeePage';
import ExportAttendancePage from './pages/ExportAttendancePage';
import { getUserInfo } from './utils/auth';
import './css/style.css';

function App() {
  const user = getUserInfo();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/punch" element={<PunchPage />} />
        <Route path="/apply-leave" element={<ApplyLeavePage />} />
        <Route path="/my-leaves" element={<MyLeaveRequests />} />
        <Route path="/attendance-requests" element={<AdminAttendanceRequests />} />
        <Route path="/employee-list" element={<EmployeeListPage />} />
        <Route path="/edit-employee/:id" element={<EditEmployeePage />} />
        <Route path="/view-attendance/:employeeId" element={<ViewEmployeeAttendancePage />} />
        <Route path="/register" element={<RegisterEmployeePage />} />
        <Route path="/export-attendance" element={<ExportAttendancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
