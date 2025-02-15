const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const pool = require('../db');

const app = express();

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});

app.use(limiter);

// Send an email
const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const token = req.body.verifyToken
    if(token){
      pool.query('SELECT * FROM users WHERE verify_token = ?', [token], (error, results) => {
        if (error) {
          console.error('Error during query:', error);
        }
  
        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            if (results[i].verified === 'false') {
              const updateQuery = 'UPDATE users SET verified = ?, verify_token = ? WHERE user_id = ?';
              const verified = 'true';
              const anotherValue = null; // Change this to whatever value you want for another_column
              pool.query(updateQuery, [verified, anotherValue, results[i].user_id]);
              return res.status(200).json({ message: 'Validation Succesful' });
            }
          }
        }else{
          console.log('no such token exists')
        }
      });
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
});

module.exports = router;
