const express = require('express');
const router = express.Router();
const User = require('../models/dburl'); 
const jwt = require("jsonwebtoken");
const SECRET_KEY = "PRACTICE";

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email: email });
    
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already registered' });
    }
    
    // Note: Ensure to use a secure hashing algorithm instead of plain text
    // Here we're using a simple hash function for demonstration purposes
    const hashedPassword = hash(password);
    
    const data = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    
    // Generate JWT token
    const token = jwt.sign({ email: data.email, id: data.id }, SECRET_KEY);
    
    console.log(data);
    res.status(201).redirect('/signin');
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;

// Simple hash function for demonstration, replace with secure hashing algorithm
function hash(password) {
  // Replace this implementation with a secure hashing algorithm
  // Example: return bcrypt.hash(password, saltRounds);
  return password + "hashed"; // This is not secure, just for demonstration
}
