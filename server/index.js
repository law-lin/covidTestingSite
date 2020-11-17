const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// Use middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const allEmployees = await pool.query('SELECT * FROM employee');
    res.json(allEmployees.rows);
  } catch (err) {
    console.log(err.message);
  }
});
// Get an employee
app.get('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await pool.query(
      'SELECT * FROM employee WHERE employee_id = $1',
      [id]
    );
    res.json(employee.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});
// Create new employee
app.post('/employees', async (req, res) => {
  try {
    const { employee_id, email, first_name, last_name } = req.body;
    const newEmployee = await pool.query(
      'INSERT INTO employee (employee_id, email, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [employee_id, email, first_name, last_name]
    );
    res.json(newEmployee.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

/////////// Test Collection Page Routes ///////////
// Adds a new employee test to the test collection
app.post('/test-collection', async (req, res) => {
  try {
    const {
      test_barcode,
      employee_id,
      collection_time,
      collected_by,
    } = req.body;
    const newEmployeeTest = await pool.query(
      'INSERT INTO employee_test (test_barcode, employee_id, collection_time, collected_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [test_barcode, employee_id, collection_time, collected_by]
    );
    res.json(newEmployeeTest.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});
// Deletes an employee test from the test collection
app.delete('/test-collection/:id', async (req, res) => {
  try {
    const { id } = req.body;
    const deleteEmployee = await pool.query(
      'DELETE FROM employee_test WHERE employee_id = $1',
      [id]
    );
    res.json(deleteEmployee.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

///// Pool Mapping Page Routes //////
// Create a new pool
app.post('/pool-mapping', async (req, res) => {
  try {
    const { test_barcode, pool_barcode } = req.body;
    const poolMap = await pool.query(
      'INSERT INTO pool_map (test_barcode, pool_barcode) VALUES ($1, $2)',
      [test_barcode, pool_barcode]
    );

    const newPool = await pool.query(
      'INSERT INTO pool (pool_barcode) VALUES ($1)',
      [pool_barcode]
    );

    res.json(poolMap.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
