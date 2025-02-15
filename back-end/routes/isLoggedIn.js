// validate-token.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});


// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }
  try {
    const decoded = jwt.verify(token, 'LB7/9rMBtdAu/Vnc7eKDavAYiVB2cwRKKzfMKiEe1iY=');
    req.user_id = decoded;
    next();
  } catch (error) {
    console.log(error)
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Route to check if user is logged in (token validation)
router.get('/', verifyToken, (req, res) => {
  pool.query('SELECT * FROM users WHERE user_id = ?', [req.user_id.user_id], (error, results) => {
    if (error) {
      console.error('Error during query:', error);
    }

    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        res.json({ user: req.user_id.user_id , username: results[i].username, profile_picture: results[i].profile_picture}); 
      }
    }else{
        return
    }
  });
});

module.exports = router;
