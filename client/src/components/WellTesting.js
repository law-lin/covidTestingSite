import React from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Button, Typography, Select } from 'antd';

const { Option } = Select;

function WellTesting() {
  return (
    <div>
      <Space direction='vertical'>
        <Typography>
          <Typography.Title>Well Testing</Typography.Title>
        </Typography>
        <Input addonBefore='Well barcode:' placeholder='Ex: 444' />
        <Input addonBefore='Pool barcode:' placeholder='Ex: 098' />
        <Select defaultValue='in progress' style={{ width: 120 }}>
          <Option value='in progress'>In Progress</Option>
          <Option value='negative'>Negative</Option>
          <Option value='positive'>Positive</Option>
        </Select>
        <Button type='primary'>Add</Button>
      </Space>
    </div>
  );
}

export default WellTesting;
