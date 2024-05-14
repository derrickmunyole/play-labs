/**
 * Middleware to obtain bearer token from Spotify
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>} - Resolves when the middleware completes
 */

const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();

const getSpotifyToken = async (req, res, next) => {
  try {
    // Create the base64 encoded credentials
    const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

    // Make a POST request to Spotify to obtain the token
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': `Basic ${credentials}`, // Set the Authorization header with the base64 encoded credentials
        'Content-Type': 'application/x-www-form-urlencoded' // Set the Content-Type header
      },
      data: qs.stringify({ // Send the grant_type parameter as x-www-form-urlencoded
        grant_type: 'client_credentials'
      })
    });

    // Set the Spotify token on the request object and call the next middleware
    req.spotifyToken = response.data.access_token;
    next();
  } catch (error) {
    // Log and send an error response if an error occurs
    console.error('Error obtaining Spotify token:', error);
    res.status(500).send('Error obtaining Spotify token: ' + error.message);
  }
};

module.exports = getSpotifyToken;