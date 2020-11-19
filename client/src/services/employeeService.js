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

const getLabEmployee = (token) => {
  return axios.get(`${baseUrl}/lab-employees/${token}`);
};

const addTest = (test) => {
  return axios.post(`${baseUrl}/test-collection`, test);
};

const getEmployeeTests = () => {
  return axios.get(`${baseUrl}/test-collection`);
};

export default {
  authorize,
  signUp,
  logIn,
  getLabEmployee,
  addTest,
  getEmployeeTests,
};
