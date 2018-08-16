/**
 * Set up the various sub routes of the application loaded by route "section" such as bp or users
 * @param app
 */
module.exports = function(app){

  app.use('/api/users', require('./routes/users'));
  app.use('/api/groups', require('./routes/groups'));
  app.use('/api/settings', require('./routes/settings'));
  app.use('/api/gatelist', require('./routes/gatelist'));

};