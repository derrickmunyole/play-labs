const express = require("express")
const axios = require("axios")
const getSpotifyToken = require("../../../middleware/authentication")
const router = express.Router()
const { redisClient } = require('../../../redis/client')
const retry = require('../../../utils/retry');


router.get('/', getSpotifyToken, async(req, res) => {
    try {
        const type = req.query.type;
        const accessToken = await redisClient.get(`accessToken:creed`);

        const fetchFollowedArtists = async () => {
            return axios.get('https://api.spotify.com/v1/me/following', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {type: type}
            });
        };


        retry(fetchFollowedArtists)
       .then(response => {
            res.json(response.data);
        })
       .catch(error => {
            console.error("Error making request to /me/following:", error);
            res.status(500).json({ error: 'An error occurred while fetching followed artists.' });
        });
    } catch (error) {
        console.error("Error in followedartists.js:", error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router;

module.exports = router