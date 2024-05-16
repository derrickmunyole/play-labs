const express =  require('express');
const axios =  require('axios');
const router = express.Router();
const getSpotifyToken = require('../../../middleware/authentication');
const retry = require('../../../utils/retry');
const redisClient = require('../../../redis/client');

router.post('/', getSpotifyToken, async(req, res) => {
    try {
        const userId = await redisClient.get('userId');
        const accessToken = await redisClient.get(`accessToken:${userId}`)

        const createPlaylist = async () => {
            return axios.post(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    name: req.body.name,
                    description: req.body.description,
                    public: req.body.public
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
        };

        retry(createPlaylist, {
            retries: 3,
            delay: 1000,
            factor: 2
        })
       .then(response => {
            res.json(response.data);
        })
       .catch(error => {
            console.error("Error making request to /playlist:", error);
            res.status(500).json({ error: 'An error occurred while creating your playlist.' });
        });        
    } catch (error) {
        console.error("Error in createplaylist.js:", error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router;