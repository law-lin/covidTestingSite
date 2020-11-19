const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('./utils/jwtGenerator');
const validation = require('./middleware/validation');
const authorization = require('./middleware/authorization');

// Use middleware
app.use(cors());
app.use(express.json());

// Routes

// Register employee
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
  } catch (err) {}
});

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

// Create (register) new employee
app.post('/signup', validation, async (req, res) => {
  try {
    const { email, first_name, last_name, password, role } = req.body;
    // check if employee already exists
    const employee = await pool.query(
      `SELECT * FROM ${role} WHERE email = $1`,
      [email]
    );
    if (employee.rows.length !== 0) {
      return res.status(401).send('Employee already exists');
    }
    // encrpyt password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);
    // insert new employee
    const newEmployee = await pool.query(
      `INSERT INTO ${role} (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, first_name, last_name, bcryptPassword]
    );
    // generate jwt token
    const token = jwtGenerator(newEmployee.rows[0].employee_id);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
  }
});

// Login route for employees
app.post('/login', validation, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // check if employee already exists
    const employee = await pool.query(
      `SELECT * FROM ${role} WHERE email = $1`,
      [email]
    );
    if (employee.rows.length === 0) {
      return res.status(401).json('Password or email is incorrect');
    }
    // check if passwords match
    const validPassword = bcrypt.compare(password, employee.rows[0].password);

    if (!validPassword) {
      return res.status(401).json('Password or email is incorrect');
    }
    // give user the jwt token
    const token = jwtGenerator(employee.rows[0].employee_id);
    res.json({ token, role });
  } catch (err) {
    console.log(err.message);
  }
});

// Verification route for authroization
app.post('/verify', authorization, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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
