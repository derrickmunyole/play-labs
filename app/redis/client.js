const Redis = require('ioredis');
require('dotenv').config();

// Use environment variables for Redis host and port
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

module.exports = {redisClient};