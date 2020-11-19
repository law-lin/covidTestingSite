import axios from 'axios';
const baseUrl = 'http://localhost:3001';

const authorize = () => {
  return axios.post(`${baseUrl}/verify`, null, {
    headers: { jwt_token: localStorage.token },
  });
};

const signUp = (employee) => {
  return axios.post(`${baseUrl}/signup`, employee);
};

const logIn = (employee) => {
  return axios.post(`${baseUrl}/login`, employee);
};

export default {
  authorize,
  signUp,
  logIn,
};
