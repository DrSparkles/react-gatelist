import { observable, action, computed } from 'mobx';
import agent from '../agent';
import authStore from './authStore';
import settingStore from "./settingStore";
import groupStore from "./groupStore";
// import promise from 'promise';

/**
 * Handle user actions and state
 */
class UserStore {

  @observable currentUser = {};

  @observable editingUser = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: ''
  };

  setEditingUserFromCurrentUser(){
    this.editingUser.userId = this.currentUser.userId;
    this.editingUser.firstName = this.currentUser.firstName;
    this.editingUser.lastName = this.currentUser.lastName;
    this.editingUser.email = this.currentUser.email;
    this.editingUser.userType = this.currentUser.userType;
  }

  /**
   * Loading state for fetching the user; true if we're accessing the db, false if we've fetched the user
   * @type {boolean}
   */
  @observable loading;

  /**
   * Pending values for updating user data, such as resetting username or password
   */
  @observable updatingUser;
  @observable updatingUserErrors;

  @observable password;

  @computed get isAdmin(){
    return this.currentUser && this.currentUser.userType !== undefined && this.currentUser.userType === 'admin';
  }

  @computed get isSuperAdmin(){
    return this.currentUser && this.currentUser.userType !== undefined && this.currentUser.userType === 'superadmin';
  }

  /**
   * Fetch user from the db.  On the server side the auth token will be read to determine
   * if they are authorized
   * @returns {Promise<any>}
   */
  @action pullUser() {
    this.loading = true;
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

      // this.currentUser = results.user.result.user;

      this.currentUser = this.setCurrentUser(results.user.result.user);

      console.log('pull user current user', this.currentUser);

      settingStore.setSettingData(results.settings.result[0]);
      groupStore.setUserGroups(results.groups.result);
      authStore.setUserLoggedIn(true);

      this.loading = false;
      return resolve();
    })});
  }

  @action saveUser(){
    this.loading = true;
    const user = {
      userId: this.editingUser.userId,
      firstName: this.editingUser.firstName,
      lastName: this.editingUser.lastName,
      email: this.editingUser.email
    };

    if (this.editingUser.userType){
      user.userType = this.editingUser.userType;
    }

    if (this.editingUser.password !== ''){
      user.password = this.editingUser.password;
    }
    console.log('this.editingUser', this.editingUser);
    return agent.Users
      .save(this.currentUser.userId, this.currentUser, user)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.pullUser()
          .finally(() => {
            this.setEditingUserFromCurrentUser();
            this.loading = false;
          });
      }));
  }

  setCurrentUser(userData){
    const currentUser = {};
    currentUser.userId = (userData._id) ? userData._id : userData.userId;
    currentUser.firstName = userData.firstName;
    currentUser.lastName = userData.lastName;
    currentUser.email = userData.email;
    currentUser.userType = userData.userType;
    return currentUser;
  }

  clearEditingUser(){
    this.editingUser = {
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userType: ''
    };
  }

  /**
   * Log out
   */
  @action forgetUser() {
    this.currentUser = undefined;
  }
}

export default new UserStore();
