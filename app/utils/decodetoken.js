const jwt = require('jsonwebtoken');

/**
 * Decodes the access token to extract the userId.
 * @param {string} accessToken - The access token received from Spotify.
 * @returns {Promise<string|null>} A promise that resolves with the userId or null if decoding fails.
 */
const getUserIdFromAccessToken = (accessToken) => {
    try {
      const decodedToken = jwt.decode(accessToken, { complete: true });
      const userId = decodedToken.payload.id;
      return userId;
    } catch (error) {
      console.error("Error decoding access token:", error);
      return null;
    }
  };

module.exports = getUserIdFromAccessToken;