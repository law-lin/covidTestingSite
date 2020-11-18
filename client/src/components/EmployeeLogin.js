import React from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Button, Typography } from 'antd';

function EmployeeLogin() {
  return (
    <div>
      <Space direction='vertical'>
        <Typography>
          <Typography.Title>Employee Login Page For Results</Typography.Title>
        </Typography>
        <Input placeholder='Email' />
        <Input.Password placeholder='Password' />
        <Button type='primary'>Login</Button>
      </Space>
    </div>
  );
}

export default EmployeeLogin;
