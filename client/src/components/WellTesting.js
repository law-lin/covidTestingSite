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
        setData(data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleAdd = () => {
    const well = {
      well_barcode: well_barcode.value,
      pool_barcode: pool_barcode.value,
      result,
      testing_start_time: new Date().toISOString(),
      testing_end_time: new Date().toISOString(),
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
    if (selectedWells.length !== 1) {
      const well = {
        well_barcode: selectedWells[0],
        result,
      };
      employeeService.editWell(well).then(() => {
        updateTable();
      });
    }
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
        <Button onClick={handleEdit} disabled={selectedWells.length !== 1}>
          Edit Selected Well
        </Button>
        <Button type='danger' onClick={handleDelete}>
          Delete Selected Wells
        </Button>
      </Space>
    </div>
  );
}

export default WellTesting;
