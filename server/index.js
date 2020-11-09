const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// Use middleware
app.use(cors());
app.use(express.json());

// Routes
// TODO: implement necessary routes, figure out what resources need to be created/updated/deleted

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
