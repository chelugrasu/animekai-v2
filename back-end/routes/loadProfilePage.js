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
        const urlUsername = req.body.memberUsername;
        const userName = req.body.userName;
        const isLoggedIn = req.body.isLoggedIn;
        var profileData = {
            userData: {},
            isOwner: false, 
            isAdmin: false, 
            viewedSeries: [],
            toWatchSeries: [],
            reviews: [],
            continueWatching: []
        }

        pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', [urlUsername], (error, resultsUsers) => {
            if (error) {
                console.error('Error during users query:', error);
            }
        
            if (resultsUsers.length === 0) {
                return res.status(400).json({ message: 'Invalid username' });
            }
            var viewedSeries = null;
            var toWatchSeries = null;
            profileData.userData = {
                memberUsername: resultsUsers[0].username,
                email: resultsUsers[0].email,
                profilePicture: resultsUsers[0].profile_picture,
                registerDate: resultsUsers[0].created_date,
                aboutMe: resultsUsers[0].about_me,
                profile_settings: resultsUsers[0].profile_settings,
            }
            if(resultsUsers[0].username.toLowerCase() === userName.toLowerCase() && isLoggedIn){ profileData.isOwner = true; }
            if(resultsUsers[0].adminAcces > 0){ profileData.isAdmin = true;}
            if(resultsUsers[0].viewed_series){profileData.viewedSeries = JSON.parse(resultsUsers[0].viewed_series)}
            if(resultsUsers[0].towatch_series){profileData.toWatchSeries = JSON.parse(resultsUsers[0].towatch_series)}

            pool.query('SELECT * FROM reviews WHERE LOWER(reviewer_name) = LOWER(?)', [urlUsername], (error, resultsReviews) => {
                if (error) {
                    console.error('Error during reviews query:', error);
                }
                profileData.reviews = resultsReviews
                pool.query('SELECT * FROM series', (error, resultsSeries) => {
                    if (error) {
                        console.error('Error during continue watching query:', error);
                    }
                    if(profileData.isOwner){
                        pool.query('SELECT * FROM continuewatching WHERE LOWER(user_name) = LOWER(?)', [urlUsername], (error, resultsContinueWatching) => {
                            if (error) {
                                console.error('Error during continue watching query:', error);
                            }
                            profileData.continueWatching = resultsContinueWatching
                            return res.json({ profileData, seriesData: resultsSeries });
                        });
                    }else{
                        return res.json({ profileData, seriesData: resultsSeries});
                    }
                });
            });
        });
    } catch (error) {
      console.error('Error during registration:', error);
    }
});

module.exports = router;