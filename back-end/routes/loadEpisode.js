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
    const episodeID = req.body.episodeID;
    const username = req.body.username;
    if (!episodeID) {
      return res.status(400).json({ message: 'No series in the URL' });
    }

    const query = (sql, params) => {
      return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    };

    const resultsEpisode = await query('SELECT * FROM episodes WHERE episode_id = ?', [episodeID]);
    
    if (resultsEpisode.length === 0) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    const resultsSeries = await query('SELECT * FROM series WHERE url_slug = ?', [resultsEpisode[0].series_slug]);
    const resultsEpisodes = await query(`
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
      ) ASC`, [resultsEpisode[0].series_slug]
    );
    const resultsContinueWatching = await query('SELECT * FROM continueWatching WHERE user_name = ? AND episode_id = ?', [username, episodeID]);

    res.json({ episodeData: resultsEpisode, seriesData: resultsSeries, episodesData: resultsEpisodes, continueWatchingData: resultsContinueWatching });
  } catch (error) {
    console.error('Error during request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/saveContinueWatching', async (req, res) => {
  try {
    const { episodeId, video_thumbnail, episode_title, series_slug, username, currentTimeSeconds, episode_length } = req.body;
    // Check if required parameters are provided
    if (!episodeId || !username || !currentTimeSeconds) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Check if the record already exists
    pool.query(
      'SELECT * FROM continueWatching WHERE series_slug = ? AND user_name = ?',
      [series_slug, username],
      (error, results) => {
        if (error) {
          console.error('Error during query:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
        console.log(results)
        if (results.length > 0) {
          // If the record exists, update the current_time
          pool.query('DELETE FROM continueWatching WHERE series_slug = ? AND user_name = ?',
            [series_slug, username],
            (error, deleteResults) => {
              if (error) {
                console.error('Error updating continueWatching:', error);
                return res.status(500).json({ message: 'Internal server error' });
              }
              pool.query(
                'INSERT INTO continueWatching (episode_id, video_thumbnail, episode_title, series_slug, user_name, continue_time, episode_length) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [episodeId, video_thumbnail, episode_title, series_slug, username, currentTimeSeconds, episode_length],
                (error, insertResult) => {
                  if (error) {
                    console.error('Error inserting continueWatching:', error);
                    return res.status(500).json({ message: 'Internal server error' });
                  }
                  res.status(200).json({ message: 'Continue watching saved successfully' });
                }
              );
            }
          );
        } else {
          // If the record does not exist, insert a new record
          pool.query(
            'INSERT INTO continueWatching (episode_id, video_thumbnail, episode_title, series_slug, user_name, continue_time, episode_length) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [episodeId, video_thumbnail, episode_title, series_slug, username, currentTimeSeconds, episode_length],
            (error, insertResult) => {
              if (error) {
                console.error('Error inserting continueWatching:', error);
                return res.status(500).json({ message: 'Internal server error' });
              }
              res.status(200).json({ message: 'Continue watching saved successfully' });
            }
          );
        }
      }
    );
  } catch (error) {
    console.error('Error saving continue watching:', error);
    res.status(500).json({ message: 'Internal server error' });
  }    
});


module.exports = router;
