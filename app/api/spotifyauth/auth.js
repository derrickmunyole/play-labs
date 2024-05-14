const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');
require('dotenv').config();
const { redisClient } =require('../../redis/client');
const retry = require('../../utils/retry')


const client_id = process.env.SPOTIFY_CLIENT_ID; // your clientId
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.REDIRECT_URI; // Your redirect uri


const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

let stateKey = 'spotify_auth_state';

const exchangeCodeForToken = async (authCode) => {
  // Extracting data and headers from authOptions
  const data = {
    code: authCode,
    redirect_uri: redirect_uri,
    grant_type: 'authorization_code'
  };

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  };

  // Using axios.post with the extracted data and headers
  return axios.post('https://accounts.spotify.com/api/token', data, { headers: headers });
};

const loginRoute = (app) => {
    app.get('/login', function(req, res) {
        let state = generateRandomString(16);
        console.log("Generated state:", state);
        res.cookie(stateKey, state);
      
        console.log("CLIENT ID:", client_id)
        console.log("CLIENT SECRET:",client_secret)
        console.log("REDIRECT_URI:", redirect_uri)
        // Authorization scopes
        let scope = `user-read-private 
                     user-read-email 
                     user-follow-read 
                     playlist-modify-public 
                     playlist-modify-private`;

        res.redirect('https://accounts.spotify.com/authorize?' +
          querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
          }));
    });
  };

  const callbackRoute = (app) => {
    app.get('/callback', function(req, res) {
        let code = req.query.code || null;
        let state = req.query.state || null;
        let storedState = req.cookies? req.cookies[stateKey] : null;

        console.log("Received state:", state);
        console.log("Stored state:", storedState);
      
        if (state === null || state!== storedState) {
          res.redirect('/#' +
            querystring.stringify({
              error: 'state_mismatch'
            }));
        } else {
          res.clearCookie(stateKey);

          const attemptExchange = () => exchangeCodeForToken(code);
          retry(attemptExchange)
           .then(response => {
              let access_token = response.data.access_token,
                  refresh_token = response.data.refresh_token;

                  redisClient.set(`accessToken:creed`, access_token, 'EX', 3600, (err, reply) => {
                    if (err) {
                      console.error('Error setting access token in Redis:', err);
                    } else {
                      console.log('Access token set in Redis:', reply);
                    }
                  });

                  redisClient.set(`refreshToken:tcreed`, refresh_token, 'EX', 3600, (err, reply) => {
                    if (err) {
                      console.error('Error setting access token in Redis:', err);
                    } else {
                      console.log('Refresh token set in Redis:', reply);
                    }
                  });

              return response.data
            }).catch((e) => {
              console.error("Error making request: ", e)
            });
        }
      });
      
      app.get('/refresh_token', function(req, res) {
      
        let refresh_token = req.query.refresh_token;
        let authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          headers: { 
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) 
          },
          form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
          },
          json: true
        };
      
        request.post(authOptions, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            let access_token = body.access_token,
                refresh_token = body.refresh_token;
            res.send({
              'access_token': access_token,
              'refresh_token': refresh_token
            });
          }
        });
    });
  };

module.exports = {
    loginRoute,
    callbackRoute
}