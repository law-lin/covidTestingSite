import React from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Button, Typography } from 'antd';

function TestCollection() {
  return (
    <div>
      <Space direction='vertical'>
        <Typography>
          <Typography.Title>Test Collection</Typography.Title>
        </Typography>
        <Input addonBefore='Employee ID:' placeholder='' />
        <Input addonBefore='Test barcode:' placeholder='' />
        <Button type='primary'>Add</Button>
      </Space>
    </div>
  );
}

export default TestCollection;
