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
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the rentals table with sample data
CREATE TABLE IF NOT EXISTS rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL
);

INSERT INTO rentals (city, address, name) VALUES
('Calgary', '2500 University Dr NW, Calgary, AB T2N 1N4', 'Rental 1'),
('Los Angeles', '456 Sample Rd, Los Angeles, CA', 'Rental 2'),
('Calgary', '4548 Vandergrift Crescent Northwest, Calgary, Alberta, T3A 0J2', 'Rental 3');


