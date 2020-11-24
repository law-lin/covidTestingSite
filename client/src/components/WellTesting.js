import React, { useState, useEffect } from 'react';
import { Table, Space, Input, Button, Typography, Select } from 'antd';
import employeeService from '../services/employeeService.js'

const { Option } = Select;

const useFormInput = (initVal) => {
  const [value, setValue] = useState(initVal);
  const handleChange = (e) => setValue(e.target.value);
  return {
    value,
    setValue,
    onChange: handleChange,
  };
};

function WellTesting() {
  const well_barcode = useFormInput('');
  const pool_barcode = useFormInput('');
  const columns = [
    {
      title: 'Well Barcode',
      dataIndex: 'well_barcode',
    },
    {
      title: 'Pool Barcode',
      dataIndex: 'pool_barcode',
    },
    {
      title: 'Result',
      dataIndex: 'result',
    }
  ];

  const [data, setData] = useState([]);
  const [result, setResult] = useState('in progress');
  const [selectedWells, setSelectedWells] = useState([]);


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedWells(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  useEffect(() => {
    updateTable();
  }, []);

  const updateTable = () => {
    employeeService
      .getWells()
      .then((res) => {
        let data = res.data.map((well) => {
          let o = Object.assign({}, well);
          o.key = well.well_barcode;
          return o;
        });
        setData(data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const handleAdd = () => {
    const well = {
      well_barcode: well_barcode.value,
      pool_barcode: pool_barcode.value,
      result,
      testing_start_time : new Date().toISOString(),
      testing_end_time : new Date().toISOString(),
    }
    employeeService.addWell(well).then(
      () => {
        updateTable();
      }
    ).catch(err => {console.log(err.message)})
  }

  const handleDelete = () => {
    selectedWells.forEach((well) => {
      employeeService
        .deleteWell(well)
        .then((res) => {
          updateTable();
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  };

  return (
    <div>
      <Space direction='vertical'>
        <Typography>
          <Typography.Title>Well Testing</Typography.Title>
        </Typography>
        <Input addonBefore='Well barcode:' {...well_barcode}/>
        <Input addonBefore='Pool barcode:' {...pool_barcode}/>
        <Select defaultValue='in progress' onChange = {(value) => {setResult(value)}} style={{ width: 120 }}>
          <Option value='in progress'>In Progress</Option>
          <Option value='negative'>Negative</Option>
          <Option value='positive'>Positive</Option>
        </Select>
        <Button type='primary' onClick = {handleAdd}>Add</Button>
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
        <Button type='danger' onClick={handleDelete}>
          Delete Selected Pools
        </Button>
      </Space>
    </div>
  );
}

export default WellTesting;
