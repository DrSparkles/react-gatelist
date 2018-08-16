import { observable, action, computed } from 'mobx';
import agent from '../agent';
import authStore from './authStore';
import settingStore from "./settingStore";
import groupStore from "./groupStore";
import promise from 'promise';

/**
 * Handle user actions and state
 */
class UserStore {

  /**
   * The currently logged in user.  Expecting an object containing:
   * {
   *   username: STRING,
   *   _id: INT user database id
   * }
   * @type {object}
   */
  @observable currentUser;

  @computed get isAdmin(){
    return this.currentUser && this.currentUser.userType !== undefined && this.currentUser.userType === 'admin';
  }

  @computed get isSuperAdmin(){
    return this.currentUser && this.currentUser.userType !== undefined && this.currentUser.userType === 'superadmin';
  }

  /**
   * Loading state for fetching the user; true if we're accessing the db, false if we've fetched the user
   * @type {boolean}
   */
  @observable loadingUser;

  /**
   * Pending values for updating user data, such as resetting username or password
   */
  @observable updatingUser;
  @observable updatingUserErrors;

  /**
   * Fetch user from the db.  On the server side the auth token will be read to determine
   * if they are authorized
   * @returns {Promise<any>}
   */
  @action pullUser() {
    this.loadingUser = true;
    return new Promise((resolve, reject) => {
      agent.SettingsData((err, results) => {
      if (err){
        console.log(err);
        return reject(err);
      }

      if (results.user === undefined || results.settings === undefined || results.groups === undefined){
        return reject('Pieces of the data returned were missing!');
      }

      console.log('pull user results', results);
      this.currentUser = results.user.result.user;
      settingStore.setSettingData(results.settings.result[0]);
      groupStore.setUserGroups(results.groups.result);
      authStore.setUserLoggedIn(true);
      this.loadingUser = false;
      return resolve();
    })});
    /*
    return agent.Auth
      .current()
      .then(action((user) => {
        console.log('userstore pull user current user', user.result.user);
        this.userType = user.result.user.userType;
        this.currentUser = user.result.user;
      }))
      .then(() => {
        settingStore.loadSettings();
        groupStore.loadUsersGroups();
        console.log('settingStore in pullUser', settingStore.settingValues);
        console.log('groupStore in pullUser', groupStore.getUserGroups);
      })
      .finally(action(() => {
        console.log('in finally');
        authStore.setUserLoggedIn(true);
        this.loadingUser = false;
      }))
      */
  }

  /**
   * Log out
   */
  @action forgetUser() {
    this.currentUser = undefined;
  }
}

export default new UserStore();
