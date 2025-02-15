const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../db');

const app = express();

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});

const transporter = nodemailer.createTransport({
  host: "mail.animekai.ro",
  port: 465,
  auth: {
    user: "noreply@animekai.ro",
    pass: "*D=7T(td??3O",
  },
});

app.use(limiter);

// Send an email
const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const token = req.body.emailChangeToken
    const newToken = crypto.randomBytes(20).toString('hex'); 
    if(token){
      pool.query('SELECT * FROM users WHERE new_email_token = ?', [token], (error, results) => {
        if (error) {
          console.error('Error during query:', error);
        }
  
        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            if (results[i].new_email_status === 'false'){
              const updateQuery = 'UPDATE users SET new_email_token = ?, new_email_status = ? WHERE user_id = ?';
              const anotherValue = 'true';
              pool.query(updateQuery, [newToken, anotherValue, results[i].user_id]);
              if(results[i].email !== results[i].new_email_address){
                transporter.sendMail({
                    from: 'noreply@animekai.ro',
                    to: results[i].new_email_address,
                    subject: 'Schimbare adresă de email Animekai.ro',
                    text: `Continuați prin următorul link dacă adresa de e-mail dorită este ${results[i].new_email_address} ~~~ http://localhost:8080/change-email?token=${newToken}`
                  }, (error, info) => {
                    if (error) {
                      console.error('Error sending email:', error);
                      return res.status(500).json({ message: 'Error sending verification email' });
                    }
                    console.log('Email sent:', info.response);
                    return res.status(200).json({ email: results[i].new_email_address})
                });
                return res.status(200).json({ type: 'sentSecondEmail', email: results[i].new_email_address})
              }else{
                return res.status(400).json({message: 'Email is the same as old one!'})
              }
            }else if(results[i].new_email_status === 'true'){
              if (results[i].new_email_address !== results[i].email) {
                const updateQuery = 'UPDATE users SET email = ?, new_email_address = ?, new_email_token = ?, new_email_status = ? WHERE user_id = ?';
                const anotherValue = null; // Change this to whatever value you want for another_column
                const status = 'false';
                pool.query(updateQuery, [results[i].new_email_address, anotherValue ,anotherValue, status, results[i].user_id]);
                return res.status(200).json({ type: 'emailChanged' , email: results[i].new_email_address });
              }
            }
          }
        }else{
          res.status(404).json({ type: 'incorrectToken'})
        }
      });
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
});

router.post('/getDetails', async (req, res) => {
  try {
    const token = req.body.emailChangeToken
    if(token){
      pool.query('SELECT * FROM users WHERE new_email_token = ?', [token], (error, results) => {
        if (error) {
          console.error('Error during query:', error);
        }
  
        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            const details = {oldEmail: results[i].email , newEmail: results[i].new_email_address}
            return res.status(200).json({ details: details });
          }
        }else{
          res.status(404).json({ type: 'incorrectToken'})
        }
      });
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
});


module.exports = router;
