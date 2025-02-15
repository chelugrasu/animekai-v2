const express = require('express');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const pool = require('../db');

const app = express();

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10 // limit each IP to 50 requests per windowMs
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


const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {
    try {
    const {profilePicture, userName, email, password, aboutMeValue, showWatchedSeries, showReviews, showToWatch, oldProfileData} = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const oldProfileSettings = JSON.parse(oldProfileData.profile_settings)
    if(userName.length >= 3){
        var validEmail = /\S+@\S+\.\S+/;
        if(email.match(validEmail)){
            if(password.length > 0){
                var validPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{8,25}$/
                if(password.match(validPassword)){
                    pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [userName, email], (error, results) => {
                        var usernameTaken = false;
                        var emailTaken = false;
                        if (error) {
                          console.error('Error during query:', error);
                          return res.status(500).json({ message: 'Registration failed' });
                        }
                  
                        if (results.length > 0) {
                          for (let i = 0; i < results.length; i++) {
                            if (results[i].username === userName) {
                              usernameTaken = true
                            }
                            if (results[i].email === email) {
                              emailTaken = true
                            }
                          }
                        }

                        const newSettings = [{ watchedSeries: showWatchedSeries, reviews: showReviews, toWatch: showToWatch }];
                        const oldSettings = oldProfileSettings[0];
                        const token = crypto.randomBytes(20).toString('hex'); 
                        
                        const conditions = [
                            { name: 'Profile Picture', field: 'profile_picture', value: profilePicture, condition: profilePicture !== oldProfileData.profile_picture },
                            { name: 'Username', field: 'username', value: userName, condition: userName !== oldProfileData.username && !usernameTaken },
                            { name: 'Email Adress', field: 'new_email_address', value: email, condition: email !== oldProfileData.email && !emailTaken},
                            { name: 'Email Token', field: 'new_email_token', value: token, condition: email !== oldProfileData.email && !emailTaken},
                            { name: 'Password', field: 'password', value: hashedPassword, condition: true },
                            { name: 'About Me', field: 'about_me', value: aboutMeValue, condition: aboutMeValue !== oldProfileData.about_me },
                            { name: 'Settings', field: 'profile_settings', value: JSON.stringify(newSettings), condition: JSON.stringify(oldSettings) !== JSON.stringify(newSettings) }
                        ];
                        
                        const trueConditions = conditions.filter(condition => condition.condition);
                        
                        // Construct the SET clause of the SQL query based on true conditions
                        const setClauses = trueConditions
                            .map(condition => `${condition.field} = '${condition.value}'`)
                            .join(', ');
                        
                        // Check if there are any true conditions to update
                        if (setClauses) {
                            const sql = `UPDATE users SET ${setClauses} WHERE user_id = ?`;
                        
                            // Execute the query with the dynamic SET clause
                            pool.query(sql, [results[0].user_id], (error, results) => {
                                if (error) {
                                    return res.status(400).json({ message: `Error updating profile : ${error}` })
                                } else {
                                    if(email !== oldProfileData.email){
                                        transporter.sendMail({
                                            from: 'noreply@animekai.ro',
                                            to: oldProfileData.email,
                                            subject: 'Schimbare adresă de email Animekai.ro',
                                            text: `Continuați prin următorul link dacă adresa de e-mail dorită este ${email} http://localhost:8080/change-email?token=${token}`
                                          }, (error, info) => {
                                            if (error) {
                                              console.error('Error sending email:', error);
                                              return res.status(500).json({ message: 'Error sending verification email' });
                                            }
                                            console.log('Email sent:', info.response);
                                            return res.status(200).json({ type: 'email-password', username: userName})
                                        });
                                    }else{
                                        return res.status(200).json({type: 'normal-password', username: userName})
                                    }
                                }
                            });
                        } else {
                            console.log('No true conditions to update.');
                        }   
                    });
                }else{
                    return res.status(400).json({ message: 'Invalid Password' })
                }
            }else{
                pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [userName, email], (error, results) => {
                    var usernameTaken = false;
                    var emailTaken = false;
                    if (error) {
                      console.error('Error during query:', error);
                      return res.status(500).json({ message: 'Registration failed' });
                    }
              
                    if (results.length > 0) {
                      for (let i = 0; i < results.length; i++) {
                        if (results[i].username === userName) {
                          usernameTaken = true
                        }
                        if (results[i].email === email) {
                          emailTaken = true
                        }
                      }
                    }
                    const newSettings = [{ watchedSeries: showWatchedSeries, reviews: showReviews, toWatch: showToWatch }];
                    const oldSettings = oldProfileSettings[0];
                    const token = crypto.randomBytes(20).toString('hex'); 
                    
                    const conditions = [
                        { name: 'Profile Picture', field: 'profile_picture', value: profilePicture, condition: profilePicture !== oldProfileData.profile_picture },
                        { name: 'Username', field: 'username', value: userName, condition: userName !== oldProfileData.username && !usernameTaken },
                        { name: 'Email Adress', field: 'new_email_address', value: email, condition: email !== oldProfileData.email && !emailTaken},
                        { name: 'Email Token', field: 'new_email_token', value: token, condition: email !== oldProfileData.email && !emailTaken},
                        { name: 'About Me', field: 'about_me', value: aboutMeValue, condition: aboutMeValue !== oldProfileData.about_me },
                        { name: 'Settings', field: 'profile_settings', value: JSON.stringify(newSettings), condition: JSON.stringify(oldSettings) !== JSON.stringify(newSettings) }
                    ];
                    
                    const trueConditions = conditions.filter(condition => condition.condition);
                    
                    // Construct the SET clause of the SQL query based on true conditions
                    const setClauses = trueConditions
                        .map(condition => `${condition.field} = '${condition.value}'`)
                        .join(', ');
                    
                    // Check if there are any true conditions to update
                    if (setClauses) {
                        const sql = `UPDATE users SET ${setClauses} WHERE user_id = ?`;
                    
                        // Execute the query with the dynamic SET clause
                        pool.query(sql, [results[0].user_id], (error, results) => {
                            if (error) {
                                return res.status(400).json({ message: `Error updating profile : ${error}` })
                            } else {
                                if(email !== oldProfileData.email){
                                    transporter.sendMail({
                                        from: 'noreply@animekai.ro',
                                        to: oldProfileData.email,
                                        subject: 'Schimbare adresă de email Animekai.ro',
                                        text: `Continuați prin următorul link dacă adresa de e-mail dorită este ${email} http://localhost:8080/change-email?token=${token}`
                                      }, (error, info) => {
                                        if (error) {
                                          console.error('Error sending email:', error);
                                          return res.status(500).json({ message: 'Error sending verification email' });
                                        }
                                        console.log('Email sent:', info.response);
                                        return res.status(200).json({ type: 'email', username: userName})
                                    });
                                }else{
                                    return res.status(200).json({type: 'normal', username: userName})
                                }
                            }
                        });
                    } else {
                        console.log('No true conditions to update.');
                    }         
                });
            }
        }else{
            return res.status(400).json({ message: 'Invalid Email' });
        }
    }else{
        return res.status(400).json({ message: 'Invalid Username'})
    }
    } catch (error) {
      console.error('Error saving continue watching:', error);
      res.status(500).json({ message: 'Internal server error' });
    }    
  });
  
  
  module.exports = router;