// load environment variables
require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import historyFallback from 'connect-history-api-fallback';
import morgan from 'morgan';

import authConfig from './server/config/auth.config';

const { NODE_ENV = 'development', PORT = 8080 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set auth values
app.set('authSecret', authConfig.secret);
app.set('authExpireMinutes', authConfig.authExpireMinutes);

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

// set up routing
var apiRouter = require('./server/router')(app);
app.use(historyFallback());

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));