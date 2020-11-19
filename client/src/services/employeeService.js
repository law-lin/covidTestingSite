import axios from 'axios';
const baseUrl = 'http://localhost:3001';

const authorize = () => {
  console.log(localStorage.token);
  return axios.post(`${baseUrl}/verify`, null, {
    headers: { jwt_token: localStorage.token },
  });
};
const labEmployeeSignUp = (employee) => {
  return axios.post(`${baseUrl}/lab-employee-signup`, employee);
};
const labEmployeeLogIn = () => {
  return axios.post(`${baseUrl}/lab-employee-login`);
};

const employeeSignUp = (employee) => {
  return axios.post(`${baseUrl}/employee-signup`, employee);
};
const employeeLogIn = (employee) => {
  return axios.post(`${baseUrl}/employee-login`, employee);
};

export default {
  authorize,
  labEmployeeSignUp,
  labEmployeeLogIn,
  employeeSignUp,
  employeeLogIn,
};
