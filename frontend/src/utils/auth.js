import jwt_decode from 'jwt-decode';

export const getUserInfo = () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('access');
  let decoded = null;
  if (token) {
    try {
      decoded = jwt_decode(token)
      return decoded;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    } 
  }
};
