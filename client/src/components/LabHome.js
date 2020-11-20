import React from 'react';
import { Space, Input, Button, Typography } from 'antd';

function LabHome() {
  return (
    <div>
      <Space direction='vertical'>
        <Typography>
          <Typography.Title>Lab Home</Typography.Title>
        </Typography>
        <Button type='link' href='/pool-mapping'>
          Pool Mapping
        </Button>
        <Button type='link' href='/well-testing'>
          Well Testing
        </Button>
        <Button type='link' href='/test-collection'>
          Test Collection
        </Button>
      </Space>
    </div>
  );
}

export default LabHome;
