const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'LB7/9rMBtdAu/Vnc7eKDavAYiVB2cwRKKzfMKiEe1iY=';

const app = express();

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});

app.use(limiter);

const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const loginType = req.body.loginType
    if(loginType === 'normal'){
      const email = req.body.emailValue
      const password = req.body.passwordValue
      const rememberMe = req.body.checkedBox
          var validEmail = /\S+@\S+\.\S+/;
          if(email.match(validEmail)){
            var validPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,25}$/
            if(password.match(validPassword)){
              pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) {
                  console.error('Error during query:', error);
                  return res.status(500).json({ message: 'Querying Failed' });
                }
                if (results.length > 0) {
                  for (let i = 0; i < results.length; i++) {
                    if (results[i].email === email) {
                      bcrypt.compare(password, results[i].password, (err, isMatch) => {
                        if (err) {
                          // Handle error (e.g., log it or return an error response)
                          console.error('Error comparing passwords:', err);
                          return;
                        }
                      
                        if (isMatch) {
                          if(rememberMe){
                            const user_id = results[i].user_id
                            const token = jwt.sign({ user_id: user_id }, JWT_SECRET, { expiresIn: '30d' });
                            return res.status(200).json({ token });
                            
                          }else{
                            const user_id = results[i].user_id
                            const token = jwt.sign({ user_id: user_id }, JWT_SECRET, { expiresIn: '1h' });
                            return res.status(200).json({ token });
                          }
                        } else {
                          // Passwords do not match
                          return res.status(400).json({ message: 'Invalid credentials' });
                        }
                      });
                    }
                  }
                }else{
                  return res.status(400).json({ message: 'Invalid credentials' });
                }
              });
            }else{
              return res.status(400).json({ message: 'Invalid credentials' });
            }
          }else{
            return res.status(400).json({ message: 'Invalid credentials' });
          }
    }else if(loginType === 'discord'){
      const username = req.body.usernameValue
      const email = req.body.emailValue
      const password =  Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2)
      const rememberMe = req.body.checkedBox
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
          var validEmail = /\S+@\S+\.\S+/;
          if(email.match(validEmail)){
            var validPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,25}$/
            if(password.match(validPassword)){
              pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
                if (error) {
                  console.error('Error during query:', error);
                  return res.status(500).json({ message: 'Registration failed' });
                }
          
                if (results.length > 0) {
                  for (let i = 0; i < results.length; i++) {
                    if (results[i].email === email) {
                      if(rememberMe){
                        const user_id = results[i].user_id
                        const token = jwt.sign({ user_id: user_id }, JWT_SECRET, { expiresIn: '30d' });
                        return res.status(200).json({ message: 'Succesfuly Logged In', token });
                      }
                      
                    }
                  }
                }else{
                  const insertQuery = 'INSERT INTO users (username, email, password, verified) VALUES (?, ?, ?, ?)';
                  pool.query(insertQuery, [username, email, hashedPassword, 'true']);
                  return res.status(200).json({ message: 'Registration Succesful' });
                }
                return
              });
            }else{
              return res.status(400).json({ message: 'Invalid Credentials' });
            }
          }else{
            return res.status(400).json({ message: 'Invalid Credentials' });
          }
    }
    } catch (error) {
      console.error('Error during registration:', error);
    }
});

module.exports = router;
