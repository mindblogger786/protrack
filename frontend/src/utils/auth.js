import { jwtDecode } from 'jwt-decode';

export const getUserInfo = () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('access');
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
