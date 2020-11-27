import React, { useEffect, useState } from 'react';
import { Space, Typography, Table } from 'antd';
import employeeService from '../services/employeeService';

function EmployeeResults() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      title: 'Collection Date',
      dataIndex: 'collection_time',
    },
    {
      title: 'Result',
      dataIndex: 'result',
    },
  ];

  useEffect(() => {
    updateTable();
  }, []);

  const updateTable = () => {
    employeeService
      .getEmployee(localStorage.getItem('token'))
      .then((res) => {
        employeeService.getEmployeeResults(res.data.employee_id).then((res) => {
          let data = res.data.map((test, i) => {
            let o = Object.assign({}, test);
            o.key = i;
            return o;
          });
          console.log(data);
          setData(data);
          setLoading(false);
        });
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  console.log(data);
  return (
    <>
      {!loading ? (
        <div>
          <Space direction='vertical'>
            <Typography>
              <Typography.Title>Employee Results</Typography.Title>
            </Typography>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Space>
        </div>
      ) : null}
    </>
  );
}

export default EmployeeResults;
