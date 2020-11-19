import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Button, Typography } from 'antd';
import employeeService from '../services/employeeService';

function EmployeeLogin() {
  const email = useFormInput('');
  const password = useFormInput('');

  const handleLogin = () => {
    let employee = {
      email: email.value,
      password: password.value,
    };
    employeeService
      .employeeLogIn(employee)
      .then((res) => {
        const token = res.data;
        console.log(token);
        if (token.token) {
          localStorage.setItem('token', token.token);
          window.location.href = '/employee-results';
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div>
      <Space direction='vertical'>
        <Typography>
          <Typography.Title>Employee Login Page For Results</Typography.Title>
        </Typography>
        <Input placeholder='Email' {...email} />
        <Input.Password placeholder='Password' {...password} />
        <Button type='primary' onClick={handleLogin}>
          Login
        </Button>
      </Space>
    </div>
  );
}

const useFormInput = (initVal) => {
  const [value, setValue] = useState(initVal);
  const handleChange = (e) => setValue(e.target.value);
  return {
    value,
    onChange: handleChange,
  };
};
export default EmployeeLogin;
