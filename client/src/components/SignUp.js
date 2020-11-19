import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Select, Button, Typography } from 'antd';
import employeeService from '../services/employeeService';

const { Option } = Select;

function LabLogin() {
  const email = useFormInput('');
  const firstName = useFormInput('');
  const lastName = useFormInput('');
  const password = useFormInput('');

  const [role, setRole] = useState('employee');

  const handleSignup = () => {
    let employee = {
      email: email.value,
      first_name: firstName.value,
      last_name: lastName.value,
      password: password.value,
      role,
    };

    employeeService
      .signUp(employee)
      .then((res) => {
        const data = res.data;
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', role);
          if (role === 'employee') {
            window.location.href = '/employee-results';
          } else if (role === 'lab_employee') {
            window.location.href = '/home';
          }
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
          <Typography.Title>Register New Employee</Typography.Title>
        </Typography>
        <Input placeholder='Email' {...email} />
        <Input placeholder='First Name' {...firstName} />
        <Input placeholder='Last Name' {...lastName} />
        <Input.Password placeholder='Password' {...password} />
        <Select
          defaultValue='employee'
          onSelect={(val) => setRole(val)}
          style={{ width: 120 }}
        >
          <Option value='employee'>Employee</Option>
          <Option value='lab_employee'>Lab Employee</Option>
        </Select>
        <Button type='primary' onClick={handleSignup}>
          Sign Up
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

export default LabLogin;
