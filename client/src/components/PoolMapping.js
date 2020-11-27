import React, { useState, useEffect } from 'react';

import { Space, Input, Button, Table, Typography } from 'antd';
import employeeService from '../services/employeeService';

const useFormInput = (initVal) => {
  const [value, setValue] = useState(initVal);
  const handleChange = (e) => setValue(e.target.value);
  return {
    value,
    setValue,
    onChange: handleChange,
  };
};

function PoolMapping() {
  const pool_barcode = useFormInput('');
  const [tests, setTests] = useState([{ test_barcode: '' }]);
  const [data, setData] = useState([]);
  const [selectedPools, setSelectedPools] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editedPool, setEditedPool] = useState({});
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: 'Pool Barcode',
      dataIndex: 'pool_barcode',
    },
    {
      title: 'Test Barcodes',
      dataIndex: 'string_agg',
    },
  ];

  useEffect(() => {
    updateTable();
  }, []);

  const updateTable = () => {
    employeeService
      .getPools()
      .then((res) => {
        let data = res.data.map((pool) => {
          let o = Object.assign({}, pool);
          o.key = pool.pool_barcode;
          return o;
        });
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedPools(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...tests];
    list[index][name] = value;
    setTests(list);
  };

  const handleAddTest = () => {
    setTests([...tests, { test_barcode: '' }]);
  };

  const handleRemoveTest = (index) => {
    const list = [...tests];
    list.splice(index, 1);
    setTests(list);
  };

  const handleSubmit = () => {
    const pool = {
      tests,
      pool_barcode: pool_barcode.value,
    };
    employeeService
      .addPool(pool)
      .then(() => {
        updateTable();
        pool_barcode.setValue('');
        setTests([{ test_barcode: '' }]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleEdit = () => {
    if (selectedPools.length === 1) {
      setEdit(true);
      let testBarcodes = [];
      selectedRows[0].string_agg.split(', ').forEach((test) => {
        testBarcodes.push({ test_barcode: test });
      });
      const pool = {
        tests: testBarcodes,
        pool_barcode: selectedRows[0].pool_barcode,
      };
      setEditedPool(pool);
      // Moving data to text fields
      setTests(pool.tests);
      pool_barcode.setValue(pool.pool_barcode);
    }
  };

  const handleFinishEdit = () => {
    const updatedPool = {
      tests,
      pool_barcode: pool_barcode.value,
    };
    employeeService
      .editPool(editedPool.pool_barcode, updatedPool)
      .then(() => {
        updateTable();
        pool_barcode.setValue('');
        setTests([{ test_barcode: '' }]);
        setEdit(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleDelete = () => {
    selectedPools.forEach((pool) => {
      employeeService
        .deletePool(pool)
        .then(() => {
          updateTable();
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  };

  return (
    <>
      {!loading ? (
        <div>
          <Space direction='vertical'>
            <Typography>
              <Typography.Title>Pool Mapping</Typography.Title>
            </Typography>

            <Input addonBefore='Pool barcode:' {...pool_barcode} />
            <Space direction='vertical' style={{ border: '1px solid #d9d9d9' }}>
              <Typography
                style={{
                  padding: '0 11px',
                  backgroundColor: '#fafafa',
                  borderBottom: '1px solid #d9d9d9',
                }}
              >
                Test barcodes:
              </Typography>
              {tests.map((test, i) => {
                return (
                  <Space
                    key={i}
                    direction='horizontal'
                    style={{ padding: '10px' }}
                  >
                    <Input
                      name='test_barcode'
                      value={test.test_barcode}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    {tests.length !== 1 && (
                      <Button
                        type='text'
                        danger
                        onClick={() => handleRemoveTest(i)}
                      >
                        Delete
                      </Button>
                    )}
                  </Space>
                );
              })}
              <Button style={{ margin: '10px' }} onClick={handleAddTest}>
                Add Test Barcode
              </Button>
            </Space>

            {!edit ? (
              <Button type='primary' onClick={handleSubmit}>
                Submit Pool
              </Button>
            ) : (
              <Button type='primary' onClick={handleFinishEdit}>
                Finish Editing Pool
              </Button>
            )}

            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
            <Button onClick={handleEdit} disabled={selectedPools.length !== 1}>
              Edit Selected Pool
            </Button>
            <Button type='danger' onClick={handleDelete}>
              Delete Selected Pools
            </Button>
          </Space>
        </div>
      ) : null}
    </>
  );
}

export default PoolMapping;
