const express = require('express');
const jwt = require('jsonwebtoken');
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
    let token = null;
    if (role === 'employee') {
      token = jwtGenerator(employee.rows[0].employee_id);
    } else {
      token = jwtGenerator(employee.rows[0].lab_id);
    }
    res.json({ token, role });
  } catch (err) {
    console.log(err.message);
  }
});

// Verification route for authorization
app.post('/verify', authorization, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get current lab employee
app.get('/lab-employees/:token', async (req, res) => {
  try {
    const jwtToken = req.params.token;
    if (!jwtToken) {
      return res.status(403).json('Not authorized');
    }
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);
    const labEmployee = await pool.query(
      'SELECT * FROM lab_employee WHERE lab_id=$1',
      [payload.user]
    );
    res.json(labEmployee.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
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
app.get('/employees/:token', async (req, res) => {
  try {
    const jwtToken = req.params.token;
    if (!jwtToken) {
      return res.status(403).json('Not authorized');
    }
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);
    const employee = await pool.query(
      'SELECT * FROM employee WHERE employee_id = $1',
      [payload.user]
    );
    res.json(employee.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

/////////// Test Collection Page Routes ///////////
app.get('/test-collection', async (req, res) => {
  try {
    const employeeTests = await pool.query('SELECT * FROM employee_test');
    res.json(employeeTests.rows);
  } catch (err) {
    console.log(err.message);
  }
});
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
app.delete('/test-collection/:test_barcode', async (req, res) => {
  try {
    const { test_barcode } = req.params;
    const deleteEmployee = await pool.query(
      'DELETE FROM employee_test WHERE test_barcode = $1',
      [test_barcode]
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
    const { tests, pool_barcode } = req.body;

    let checkPool = await pool.query('SELECT FROM pool WHERE pool_barcode=$1', [
      pool_barcode,
    ]);
    if (!checkPool.rows[0]) {
      // create pool if pool doesn't exist
      checkPool = await pool.query(
        'INSERT INTO pool (pool_barcode) VALUES ($1)',
        [pool_barcode]
      );
    }
    await tests.forEach((test) => {
      pool.query(
        'INSERT INTO pool_map (test_barcode, pool_barcode) VALUES ($1, $2)',
        [test.test_barcode, pool_barcode]
      );
    });
    res.json(checkPool.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});
// Get all pools
app.get('/pool-mapping', async (req, res) => {
  try {
    const pools = await pool.query(
      `SELECT pool_barcode, string_agg(test_barcode, ', ') FROM pool_map GROUP BY pool_barcode;`
    );
    res.json(pools.rows);
  } catch (err) {
    console.log(err.message);
  }
});
// Updates a pool
app.put('/pool-mapping', async (req, res) => {
  try {
    const { tests, pool_barcode } = req.params;

    await tests.forEach((test) => {
      pool.query('UPDATE pool_map SET test_barcode=$1 WHERE pool_barcode=$2', [
        test.test_barcode,
        pool_barcode,
      ]);
    });
  } catch (err) {
    console.log(err.message);
  }
});

// Deletes an employee test from the test collection
app.delete('/pool-mapping/:pool_barcode', async (req, res) => {
  try {
    const { pool_barcode } = req.params;
    const deletePoolMap = await pool.query(
      'DELETE FROM pool_map WHERE pool_barcode = $1',
      [pool_barcode]
    );
    const deletePool = await pool.query(
      'DELETE FROM pool WHERE pool_barcode = $1',
      [pool_barcode]
    );
    res.json(deletePool.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

/////////// Well Testing Page Routes ///////////
// Create a new well
app.post('/well-testing', async (req, res) => {
  try {
    const {
      well_barcode,
      pool_barcode,
      result,
      testing_start_time,
      testing_end_time,
    } = req.body;

    await pool.query('INSERT INTO well (well_barcode) VALUES ($1)', [
      well_barcode,
    ]);
    const newWell = await pool.query(
      'INSERT INTO well_testing (pool_barcode, well_barcode, testing_start_time, testing_end_time, result) VALUES ($1, $2, $3, $4, $5)',
      [pool_barcode, well_barcode, testing_start_time, testing_end_time, result]
    );

    res.json(newWell.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});
// Get all wells
app.get('/well-testing', async (req, res) => {
  try {
    const wells = await pool.query(`SELECT * FROM well_testing`);
    res.json(wells.rows);
  } catch (err) {
    console.log(err.message);
  }
});
// Updates a well
app.put('/well-testing', async (req, res) => {
  try {
    const { well_barcode, result } = req.params;

    const updatedWell = await pool.query(
      'UPDATE well_testing SET result=$2 WHERE well_barcode=$1',
      [well_barcode, result]
    );

    res.json(updatedWell.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});
// Deletes a well
app.delete('/well-testing/:well_barcode', async (req, res) => {
  try {
    const { well_barcode } = req.params;
    const deleteWellTest = await pool.query(
      'DELETE FROM well_testing WHERE well_barcode = $1',
      [well_barcode]
    );
    const deleteWell = await pool.query(
      'DELETE FROM well WHERE well_barcode = $1',
      [well_barcode]
    );
    res.json(deleteWell.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

/////////// Employee Results Route ///////////
app.get('/employee-results/:employee_id', async (req, res) => {
  try {
    const { employee_id } = req.params;
    const wells = await pool.query(
      `SELECT e.collection_time, w.result 
      FROM employee_test e 
      INNER JOIN pool_map p ON e.test_barcode=p.test_barcode
      INNER JOIN well_testing w ON w.pool_barcode=p.pool_barcode
      WHERE e.employee_id=$1;`,
      [employee_id]
    );
    res.json(wells.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
