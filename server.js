const express = require('express');
const bodyParser = require('body-parser');
const historyFallback = require('connect-history-api-fallback');
const morgan = require('morgan');

const authConfig = require('./server/config/auth.config');

const { NODE_ENV = 'development', PORT = 8080 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set auth values
app.set('authSecret', authConfig.secret);
app.set('authExpireMinutes', authConfig.authExpireMinutes);

// use morgan to log requests to the console
app.use(morgan('dev'));

// set up routing
// var apiRouter = require('./router')(app);
app.use(historyFallback());

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));