import React, { useState, useEffect } from 'react';
import { Space, Input, Button, Typography, Select, Table } from 'antd';
import employeeService from '../services/employeeService';

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
  const [result, setResult] = useState('in progress');
  const [data, setData] = useState([]);
  const [selectedWells, setSelectedWells] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editedWell, setEditedWell] = useState({});
  const [loading, setLoading] = useState(true);

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
    },
  ];

  useEffect(() => {
    updateTable();
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedWells(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const updateTable = () => {
    employeeService
      .getWells()
      .then((res) => {
        let data = res.data.map((well) => {
          let o = Object.assign({}, well);
          o.key = well.well_barcode;
          return o;
        });
        console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  const handleAdd = () => {
    const well = {
      well_barcode: well_barcode.value,
      pool_barcode: pool_barcode.value,
      result,
      testing_start_time: new Date().toISOString(),
    };
    employeeService
      .addWell(well)
      .then(() => {
        updateTable();
        well_barcode.setValue('');
        pool_barcode.setValue('');
        setResult('in progress');
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleEdit = () => {
    if (selectedWells.length === 1) {
      setEdit(true);
      const well = {
        well_barcode: selectedRows[0].well_barcode,
        pool_barcode: selectedRows[0].pool_barcode,
        result: selectedRows[0].result,
        testing_start_time: selectedRows[0].testing_start_time,
      };
      setEditedWell(well);
      // Moving data to text fields
      well_barcode.setValue(well.well_barcode);
      pool_barcode.setValue(well.pool_barcode);
    }
  };

  const handleFinishEdit = () => {
    const updatedWell = {
      well_barcode: well_barcode.value,
      pool_barcode: pool_barcode.value,
      result,
      testing_start_time: editedWell.testing_start_time,
      testing_end_time: new Date().toISOString(),
    };
    employeeService
      .editWell(editedWell.well_barcode, updatedWell)
      .then(() => {
        updateTable();
        well_barcode.setValue('');
        pool_barcode.setValue('');
        setResult('in progress');
        setEdit(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleDelete = () => {
    selectedWells.forEach((well) => {
      employeeService
        .deleteWell(well)
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
              <Typography.Title>Well Testing</Typography.Title>
            </Typography>
            <Input addonBefore='Well barcode:' {...well_barcode} />
            <Input addonBefore='Pool barcode:' {...pool_barcode} />
            <Select
              defaultValue='in progress'
              value={result}
              onChange={(value) => {
                setResult(value);
              }}
              style={{ width: 120 }}
            >
              <Option value='in progress'>In Progress</Option>
              <Option value='negative'>Negative</Option>
              <Option value='positive'>Positive</Option>
            </Select>
            {!edit ? (
              <Button type='primary' onClick={handleAdd}>
                Add Well
              </Button>
            ) : (
              <Button type='primary' onClick={handleFinishEdit}>
                Finish Editing Well
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
            <Button onClick={handleEdit} disabled={selectedWells.length !== 1}>
              Edit Selected Well
            </Button>
            <Button type='danger' onClick={handleDelete}>
              Delete Selected Wells
            </Button>
          </Space>
        </div>
      ) : null}
    </>
  );
}

export default WellTesting;
