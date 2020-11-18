import React from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Button, Typography } from 'antd';

function LandingPage() {
  return (
    <div>
      <Space direction='vertical'>
        <Typography>
          <Typography.Title>COVID-19 Testing Site</Typography.Title>
        </Typography>
        <Button type='link' href='/labtech'>
          Are you a lab employee? Click here!
        </Button>
        <Button type='link' href='/employee'>
          Are you an employee looking for results? Click here!
        </Button>
      </Space>
    </div>
  );
}

export default LandingPage;
