// load environment variables
//require('dotenv').config();
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import historyFallback from 'connect-history-api-fallback';
import morgan from 'morgan';
import path from 'path';

import authConfig from './server/config/auth.config';

const PORT = 8080;

const { NODE_ENV = 'development' } = process.env;

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
//var apiRouter = require('./server/router')(app);
import {routes as apiRouter} from './server/router';
apiRouter(app);

app.use(historyFallback());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));