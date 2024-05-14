const express = require('express');
const app = express();
const spotifyRoutes = require('./api/spotify');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { loginRoute, callbackRoute } = require('./api/spotifyauth/auth');


// Middleware and routes setup
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//authorization routes
loginRoute(app)
callbackRoute(app)

app.use(require('./middleware/authentication'));
app.use('/api', spotifyRoutes);
app.use(require('./middleware/errorhandling'));

module.exports = app;