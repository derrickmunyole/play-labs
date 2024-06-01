const express = require('express');
const axios = require('axios');
const router = express.Router();

const getSpotifyToken = require('../../../middleware/authentication');
const retry = require('../../../utils/retry');

/**
 * @openapi
 * /search:
 *   get:
 *     summary: Search for items on Spotify
 *     description: Perform a search query on Spotify to find songs, albums, or artists.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search term to look for.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         enum: ['album', 'artist', 'track', 'playlist']
 *         default: 'track'
 *         description: The type of item to search for.
 *     responses:
 *       200:
 *         description: A list of matching items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchResultItem'
 *       400:
 *         description: Bad request. Missing required parameter(s).
 *       500:
 *         description: Internal server error.
 */
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