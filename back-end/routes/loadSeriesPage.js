const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const pool = require('../db');

const app = express();

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1 // limit each IP to 50 requests per windowMs
});

app.use(limiter);

// Send an email
const router = express.Router();
router.use(bodyParser.json());

router.get('/', async (req, res) => {
  console.log("here")
  try {
      pool.query('SELECT * FROM series', (error, results) => {
        if (error) {
          console.error('Error during query:', error);
        }
  
        if (results.length > 0) {
            res.json({ series: results });
        }else{
          console.log('no series exists')
        }
      });
  } catch (error) {
    console.error('Error during registration:', error);
  }
});

module.exports = router;
