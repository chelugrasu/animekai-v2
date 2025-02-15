const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const pool = require('../db');
const bcrypt = require('bcrypt');

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
    const token = req.body.resetToken
    const passwordOne = req.body.passwordOne
    const passwordTwo = req.body.passwordTwo
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwordOne, saltRounds);
    if(token){
        var validPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,25}$/
        if(passwordOne.match(validPassword)){
            if(passwordTwo.match(validPassword)){
                if(passwordOne === passwordTwo){
                    pool.query('SELECT * FROM users WHERE forgot_token = ?', [token], (error, results) => {
                        if (error) {
                          console.error('Error during query:', error);
                        }
                    
                        if (results.length > 0) {
                          for (let i = 0; i < results.length; i++) {
                            const updateQuery = 'UPDATE users SET password = ?, forgot_token = ? WHERE user_id = ?';
                            const verified = 'true';
                            const anotherValue = null; // Change this to whatever value you want for another_column
                            pool.query(updateQuery, [hashedPassword, anotherValue, results[i].user_id]);
                            return res.status(200).json({ message: 'Password changed succesfully' });
                          }
                        }else{
                            return res.status(400).json({ message: 'Token is invalid or expired' });
                        }
                      });
                }else{
                    return res.status(400).json({ message: 'Passwords are different' });
                }
            }else{
                return res.status(400).json({ message: 'Invalid password two' });
            }
        }else{
            return res.status(400).json({ message: 'Invalid password one' });
        }
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
});



module.exports = router;
