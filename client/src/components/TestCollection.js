import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Space, Input, Button, Table, Typography } from 'antd';
import employeeService from '../services/employeeService';

function TestCollection() {
  const employee_id = useFormInput('');
  const test_barcode = useFormInput('');
  const [data, setData] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employee_id',
    },
    {
      title: 'Test Barcode',
      dataIndex: 'test_barcode',
    },
  ];

  useEffect(() => {
    updateTable();
  }, []);

  const updateTable = () => {
    employeeService
      .getEmployeeTests()
      .then((res) => {
        let data = res.data.map((test) => {
          let o = Object.assign({}, test);
          o.key = test.test_barcode;
          return o;
        });
        setData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedTests(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleAdd = () => {
    employeeService
      .getLabEmployee(localStorage.getItem('token'))
      .then((res) => {
        let test = {
          test_barcode: test_barcode.value,
          employee_id: employee_id.value,
          collection_time: new Date().toISOString(),
          collected_by: res.data.lab_id,
        };
        employeeService
          .addTest(test)
          .then((res) => {
            updateTable();
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleDelete = () => {
    selectedTests.forEach((test) => {
      employeeService
        .deleteTest(test)
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
          <Typography.Title>Test Collection</Typography.Title>
        </Typography>
        <Input addonBefore='Employee ID:' placeholder='' {...employee_id} />
        <Input addonBefore='Test barcode:' placeholder='' {...test_barcode} />
        <Button type='primary' onClick={handleAdd}>
          Add
        </Button>
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
          Delete Selected Rows
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

export default TestCollection;
