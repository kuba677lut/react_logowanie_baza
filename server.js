const path = require('path');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'egz_log',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    (err, result) => {
      if (err) {
        res.status(500).send('Error registering user');
      } else {
        res.status(200).send('User registered successfully');
      }
    }
  );
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, result) => {
      if (err) {
        res.status(500).send('Error logging in');
      } else if (result.length > 0) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Invalid credentials');
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
});

// Handle the root path
app.get('/', (req, res) => {
    res.send('Server is running. Please use the /register or /login endpoints.');
  });