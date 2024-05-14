const express =  require('express');
const axios =  require('axios');
const router = express.Router();
const getSpotifyToken = require('../../../middleware/authentication');
const { redisClient } = require('../../../redis/client');