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

// API to get listings based on city
app.get('/api/listings', (req, res) => {
  const city = req.query.city;
  const query = 'SELECT * FROM listings WHERE city = ?';

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
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '3h' });
        return res.status(200).json({ message: 'Login successful', token });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    });
  });
});


app.post('/api/add-listing', verifyToken, (req, res) => {
  const {
    city,
    address,
    name,
    description,
    price,
    water,
    electricity,
    internet,
    heat,
    property_type,
    rooms,
    bathrooms,
    area
  } = req.body;

  // Check if all required fields are present
  const requiredFields = ['city', 'address', 'name', 'description', 'price', 'property_type', 'rooms', 'bathrooms', 'area'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  const userId = req.user.id;

  const query = `
    INSERT INTO listings (
      user_id, 
      city, 
      address, 
      name, 
      description, 
      price, 
      water, 
      electricity, 
      internet, 
      heat, 
      property_type, 
      rooms, 
      bathrooms, 
      area
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query, 
    [
      userId,
      city,
      address,
      name,
      description,
      price,
      water ? 1 : 0,
      electricity ? 1 : 0,
      internet ? 1 : 0,
      heat ? 1 : 0,
      property_type,
      rooms,
      bathrooms,
      area
    ], 
    (err, result) => {
      if (err) {
        console.error('Database query failed:', err);
        return res.status(500).json({ error: 'Database query failed', details: err.message });
      }

      res.status(201).json({ message: 'Listing added successfully' });
    }
  );
});

// API to get a rental by ID
app.get('/api/rental/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM listings WHERE id = ?'; // Update table name to listings

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err); // Log the error
      res.status(500).json({ error: 'Database query failed' });
    } else if (results.length > 0) {
      res.json(results[0]);
    } else {
      console.log('No listing found with ID:', id); // Log when no listing is found
      res.status(404).json({ error: 'Listing not found' });
    }
  });
});




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
