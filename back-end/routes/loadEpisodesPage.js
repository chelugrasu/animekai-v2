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
    const seriesNameSlug = req.body.seriesName;
    if(seriesNameSlug){
      pool.query('SELECT * FROM series WHERE url_slug = ?', [seriesNameSlug], (error, resultsSeries) => {
        if (error) {
          console.error('Error during query:', error);
        }
  
        if (resultsSeries.length > 0) {
          pool.query('SELECT * FROM reviews WHERE reviewed_series_slug = ? AND approved = ?', [seriesNameSlug, 1], (error, resultsReviews) => {
            if (error) {
              console.error('Error during query:', error);
            }
            pool.query(`
            SELECT * FROM episodes WHERE series_slug = ? ORDER BY 
              CAST(
                REPLACE(
                  REPLACE(
                    SUBSTRING(episode_title, 1, 4), 
                    '.', 
                    ''
                  ),
                  ' ', 
                  ''
                ) AS UNSIGNED
              ) ASC`, [seriesNameSlug], (error, resultsEpisodes) => {
            if (error) {
              console.error('Error during query:', error);
              // Handle error
            }
          
            if (resultsEpisodes.length > 0) {
              if (resultsReviews.length > 0) {
                return res.json({ seriesData: resultsSeries, episodesData: resultsEpisodes, reviewsData: resultsReviews });
              } else {
                return res.json({ seriesData: resultsSeries, episodesData: resultsEpisodes });
              }
            } else {
              if (resultsReviews.length > 0) {
                return res.json({ seriesData: resultsSeries, reviewsData: resultsReviews });
              } else {
                return res.json({ seriesData: resultsSeries });
              }
            }
          });
          });
        }
      });
    }else{
        return res.status(400).json({ message: 'No series in the URL' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
});

module.exports = router;
