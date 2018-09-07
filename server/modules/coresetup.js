
import {db, returnSimpleError, returnSimpleResult} from '../lib/db';
import users from '../modules/users';
import settings from '../modules/settings';

class CoreSetup {

  constructor(){
    this.user_collection = db.get('users');
  }

  createSuperUser(cb){

    this.user_collection.find({}, (err, docs) => {

      if (err) return returnSimpleError(err, 400, cb);

      if (docs.length > 0){
        const response = {
          setup: 'Server setup has already happened'
        };
        return returnSimpleResult(err, response, cb);
      }

      const user = {
        firstName: 'Gwendo',
        lastName: 'Warfield',
        email: 'gwen@yellowness.com',
        password: 'pass',
        userType: 'superadmin'
      };

      const settingsObj = {
        startWeekend: '2018-01-01',
        numWeeks: 6,
        defaultNumGLSlots: 10
      };

      users.createNew(user, (err, result) => {
        if (err) return returnSimpleError(err, 400, cb);

        settings.createNew(settingsObj, (settingsErr, settingsResult) => {
          if (err) return returnSimpleError(settingsErr, 400, cb);

          const response = {
            setup: 'Server setup went splendidly'
          };

          return returnSimpleResult(err, response, cb);
        });
      });
    });
  }

}

export default new CoreSetup();