const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const pool = require('../db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 25 // limit each IP to 50 requests per windowMs
});

app.use(limiter);

const transporter = nodemailer.createTransport({
    host: "mail.animekai.ro",
    port: 465,
    auth: {
      user: "noreply@animekai.ro",
      pass: "*D=7T(td??3O",
    },
  });

// Send an email
const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const email = req.body.emailValue
    var validEmail = /\S+@\S+\.\S+/;
    if(email.match(validEmail)){
        pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
          if (error) {
            console.error('Error during query:', error);
            return res.status(500).json({ message: 'Registration failed' });
          }
    
          if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                const updateQuery = 'UPDATE users SET forgot_token = ? WHERE email = ?';
                const token = crypto.randomBytes(20).toString('hex'); 
                pool.query(updateQuery, [token, email]);
                transporter.sendMail({
                  from: 'noreply@animekai.ro',
                  to: email,
                  subject: 'Resetare parola AnimeKai.ro',
                  text: `Apăsați următorul link pentru resetarea parolei contului dumneavoastră: http://localhost:8080/reset-password?token=${token}`
                }, (error, info) => {
                  if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending verification email' });
                  }
                  console.log('Email sent:', info.response);
                return res.status(200).json({ message: 'Registration Succesful' });
              });
            }
          }
        });
    }else{
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
});

module.exports = router;
