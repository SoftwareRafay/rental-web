//Server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '123456', // Replace with your MySQL password
  database: 'rental_app' // Database name
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret key

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, JWT_SECRET, (err, authData) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = authData;
      next();
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

// API to get rentals based on city
app.get('/api/rentals', (req, res) => {
  const city = req.query.city;
  const query = 'SELECT * FROM rentals WHERE city = ?';

  db.query(query, [city], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Validate that all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Error hashing password' });
    }

    // Insert the user into the database
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

    db.query(query, [name, email, hash], (err, result) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Database query failed' });
      }

      res.status(201).json({ message: 'User created successfully' });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }

      if (isMatch) {
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    });
  });
});


// Protected route to add a listing
app.post('/api/add-listing', verifyToken, (req, res) => {
  const { city, address, name, description, price } = req.body;
  const userId = req.user.id;

  const query = 'INSERT INTO listings (user_id, city, address, name, description, price) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [userId, city, address, name, description, price], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.status(201).json({ message: 'Listing added successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
