/**
 * Set up the various sub routes of the application loaded by route "section" such as bp or users
 * @param app
 */
module.exports = function(app){

  app.use('/api/users', require('./routes/users'));
  // app.use('/api/lists', require('./routes/tasklist'));

};