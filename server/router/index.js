import router from "./routes/users";

/**
 * Set up the various sub routes of the application loaded by route "section" such as bp or users
 * @param app
 */
// module.exports = function(app){
//
//   import {router as users} from './routes/users';
//
//   //app.use('/api/users', require('./routes/users'));
//   app.use('/api/users', users);
//   app.use('/api/groups', require('./routes/groups'));
//   app.use('/api/settings', require('./routes/settings'));
//   app.use('/api/gatelist', require('./routes/gatelist'));
//
//   app.use('/script/setup', require('./routes/setup'));
//
// };

import {router as userRouter} from './routes/users';
import {router as groupsRouter} from './routes/groups';
import {router as settingsRouter} from './routes/settings';
import {router as gatelistRouter} from './routes/gatelist';
import {router as setupRouter} from './routes/setup';

function routes(app){
  app.use('/api/users', userRouter);
  app.use('/api/groups', groupsRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/gatelist', gatelistRouter);

  app.use('script/setup', setupRouter);
}

export {routes};