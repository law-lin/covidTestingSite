import React, { useState } from 'react';
import { Space, Input, Button, Typography } from 'antd';
import employeeService from '../services/employeeService';

function EmployeeLogin() {
  const email = useFormInput('');
  const password = useFormInput('');

  const handleLogin = () => {
    let employee = {
      email: email.value,
      password: password.value,
      role: 'employee',
    };
    employeeService
      .logIn(employee)
      .then((res) => {
        const data = res.data;
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
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
