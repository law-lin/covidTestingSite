import React from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Button, Typography } from 'antd';

function PoolMapping() {
  return (
    <div>
      <Space direction='vertical'>
        <Typography>
          <Typography.Title>Pool Mapping</Typography.Title>
        </Typography>
        <Input addonBefore='Pool barcode:' placeholder='Ex: 444' />
        <Input addonBefore='Test barcodes:' placeholder='' />
        <Button type='primary'>Submit Pool</Button>
      </Space>
    </div>
  );
}

export default PoolMapping;
