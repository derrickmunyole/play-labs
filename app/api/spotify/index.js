const express = require('express');
const router = express.Router();

// route imports
const spotifySearchRouter = require('./endpoints/search');
const spotifyRecommendationsRouter = require('./endpoints/recommendations');
const followedArtists = require('./endpoints/followedartists')

// routes
router.use('/spotify/search', spotifySearchRouter);
router.use('/spotify/recommendations', spotifyRecommendationsRouter);
router.use('/spotify/followedArtists', followedArtists)


module.exports = router;