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
const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {
  try {
    const seriesSlug = req.body.seriesSlug
    const username = req.body.username
    const rating = req.body.rating + 1
    const isSpoiler = req.body.isSpoiler
    const description = req.body.description
    if(username.length >= 3){
            pool.query('SELECT * FROM series WHERE url_slug = ?', [seriesSlug], (error, results) => {
              if (error) {
                console.error('Error during query:', error);
                return res.status(500).json({ message: 'Review Failed' });
              }
        
              if (results.length > 0) {
                pool.query('SELECT * FROM reviews WHERE reviewed_series_slug = ? AND approved = ?', [seriesSlug, 1], (error, results) => {
                    if (error) {
                      console.error('Error during query:', error);
                      return res.status(500).json({ message: 'Review Failed' });
                    }
              
                    if (results.length > 0) {
                        const ratings = results.map(result => result.review_rating);
                        ratings.push(rating); 
                        const sum = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                        const averageRating = Math.round((sum / ratings.length));
                        const insertQuery = 'INSERT INTO reviews (reviewed_series_slug, reviewer_name, review_rating, review_description, review_spoiler) VALUES (?, ?, ?, ?, ?)';
                        pool.query(insertQuery, [seriesSlug, username, rating, description, isSpoiler]);
                        const updateQuery = 'UPDATE series SET rating = ? WHERE url_slug = ?';
                        pool.query(updateQuery, [averageRating, seriesSlug]);
                        return res.status(200).json({ message: 'Review Succesful' });
                    }else{
                        const insertQuery = 'INSERT INTO reviews (reviewed_series_slug, reviewer_name, review_rating, review_description, review_spoiler) VALUES (?, ?, ?, ?, ?)';
                        pool.query(insertQuery, [seriesSlug, username, rating, description, isSpoiler]);
                        const updateQuery = 'UPDATE series SET rating = ? WHERE url_slug = ?';
                        pool.query(updateQuery, [rating, seriesSlug]);
                        return res.status(200).json({ message: 'Review Succesful' });
                    }
                  });
              }
            });
    }else{
      return res.status(400);
    }
  } catch (error) {
    console.error('Error during review:', error);
  }
});

module.exports = router;
