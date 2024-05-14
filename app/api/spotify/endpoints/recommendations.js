const express = require('express');
const axios = require('axios');
const router = express.Router();
const getSpotifyToken = require('../../../middleware/authentication');


router.get('/', getSpotifyToken, async (req, res) => {
 try {
    
    const spotifyApi = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      headers: {
        'Authorization': `Bearer ${req.spotifyToken}`
      }
    });

    
    const params = {
      seed_artists: '0OdUWJ0sBjDrqHygGUXeCF',
      seed_genres: 'pop',
      seed_tracks: '0c6xIDDpzE81m2q797ordA',
      limit: 5
    };

    
    const response = await spotifyApi.get('/recommendations', { params });

   
    res.json(response.data);
 } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching recommendations.');
 }
});

module.exports = router;