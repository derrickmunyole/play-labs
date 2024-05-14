/**
 * Middleware to obtain bearer token from Spotify
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>} - Resolves when the middleware completes
 */

const axios = require('axios');
const { URLSearchParams } = require('url');
require('dotenv').config();

const getSpotifyToken = async (req, res, next) => {
  try {
    
    const credentials = Buffer
        .from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
        .toString('base64');

    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({ 
        grant_type: 'client_credentials'
      })
    });

    req.spotifyToken = response.data.access_token;
    next();
  } catch (error) {

    console.error('Error obtaining Spotify token:', error);
    res.status(500).send('Error obtaining Spotify token: ' + error.message);
  }
};

module.exports = getSpotifyToken;