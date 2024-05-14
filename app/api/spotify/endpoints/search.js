const express = require('express');
const axios = require('axios');
const router = express.Router();

const getSpotifyToken = require('../../../middleware/authentication');
const retry = require('../../../utils/retry');


router.get('/', getSpotifyToken, async (req, res) => {
  try {
    const query = req.query.q; 
    const type = req.query.type; 

    
    const searchSpotify = async () => {
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
          'Authorization': `Bearer ${req.spotifyToken}`,
        },
        params: {
          q: query,
          type: type,
          limit: 10, 
        },
      });
      return response.data;
    };

    const result = await retry(searchSpotify, {
      retries: 3, 
      delay: 1000, 
      factor: 2, 
    });

    res.json(result);
  } catch (error) {
    console.error('Error searching Spotify:', error);
    res.status(500).send('Error searching Spotify');
  }
});

module.exports = router;