import React from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Button, Typography } from 'antd';

function EmployeeResults() {
  return (
    <div>
      <Space direction='vertical'>
        <Typography>
          <Typography.Title>COVID-19 Testing Site</Typography.Title>
        </Typography>
        <Input placeholder='Email' />
        <Input.Password placeholder='Password' />
        <Space>
          <Button type='primary'>Login Collector</Button>
          <Button type='primary'>Lab Login</Button>
        </Space>
      </Space>
    </div>
  );
}

export default EmployeeResults;
