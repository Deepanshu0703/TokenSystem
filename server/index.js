const mysql = require('mysql');
const express = require('express');
const cors=require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

// Create a connection pool for MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clinic',
});

// Create an express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Keep track of the current token
let currentToken = '';

// Route to get the patient list
app.get('/api/patients', (req, res) => {
  pool.query('SELECT * FROM patients ORDER BY id', (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    } else {
      res.json(result);
    }
  });
});

// Route to add a new patient and generate a token
app.post('/api/patients', (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;

  // Generate a new token based on the number of patients
  pool.query('SELECT COUNT(*) AS count FROM patients', (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    } else {
      const count = result[0].count;
      const number = count.toString().padStart(3, '0');
      const token = `T-${number}`;

      // Insert the new patient into the database
      pool.query(
        'INSERT INTO patients (name, phone, token) VALUES (?, ?, ?)',
        [name, phone, token],
        (err, result) => {
          if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
          } else {
            res.json({ id: result.insertId, token: token });
          }
        }
      );
    }
  });
});

// Route to set the current token
app.post('/api/token', async (req, res) => {
  const newToken = req.body.token;
  console.log(newToken)
  pool.query(`UPDATE tokens SET token = '${newToken}' WHERE tokens.id = 1`, (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    } else {
        res.send('OK');
    }
  });
});
app.get('/api/token', async (req, res) => {
  pool.query('SELECT token FROM tokens', (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    } else {
      res.json([result[0]]);
    }
  });
})

// WebSocket connection to broadcast current token changes
wss.on('connection', (ws) => {
  ws.send(currentToken);
});
app.listen(5000,()=>{
    console.log('server started on 5000');
})
