import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Button, Typography } from 'antd';
import employeeService from '../services/employeeService';

function LabLogin() {
  const email = useFormInput('');
  const password = useFormInput('');

  const handleLogin = (redirect) => {
    let employee = {
      email: email.value,
      password: password.value,
      role: 'lab_employee',
    };
    employeeService
      .logIn(employee)
      .then((res) => {
        const data = res.data;
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          window.location.href = redirect;
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
          <Typography.Title>Lab Employee Login</Typography.Title>
        </Typography>
        <Input placeholder='Email' {...email} />
        <Input.Password placeholder='Password' {...password} />
        <Space>
          <Button
            type='primary'
            onClick={() => handleLogin('/test-collection')}
          >
            Login Collector
          </Button>
          <Button type='primary' onClick={() => handleLogin('/home')}>
            Lab Login
          </Button>
        </Space>
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

export default LabLogin;
