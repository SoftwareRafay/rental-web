-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS rental_app;

-- Use the rental_app database
USE rental_app;

-- Create the users table for login/signup
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create the listings table for detailed rental listings
CREATE TABLE IF NOT EXISTS listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  city VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  property_type ENUM('house', 'room') NOT NULL,
  rooms INT NOT NULL,          
  bathrooms DECIMAL(2, 1) NOT NULL, 
  area DECIMAL(10, 2) NOT NULL,  
  water BOOLEAN DEFAULT FALSE,         
  electricity BOOLEAN DEFAULT FALSE,   
  internet BOOLEAN DEFAULT FALSE,       
  heat BOOLEAN DEFAULT FALSE,           
  FOREIGN KEY (user_id) REFERENCES users(id)
);
