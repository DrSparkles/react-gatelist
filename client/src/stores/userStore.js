import { observable, action, computed } from 'mobx';
import agent from '../agent';
import authStore from './authStore';
import settingStore from "./settingStore";
import groupStore from "./groupStore";
import User from "./dataStores/User";
import messagingStore from './messagingStore';

/**
 * Handle user actions and state
 */
class UserStore {

  @observable currentUser = {};

  @observable deleteUserId = '';

  @observable deletingUser = false;

  @observable users = [];

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

  @computed get isUser(){
    return this.currentUser && this.currentUser.userType !== undefined && this.currentUser.userType === 'user';
  }

  @computed get isAdmin(){
    return this.currentUser && this.currentUser.userType !== undefined && this.currentUser.userType === 'admin';
  }

  @computed get isSuperAdmin(){
    return this.currentUser && this.currentUser.userType !== undefined && this.currentUser.userType === 'superadmin';
  }

  @action loadAllUsers(){
    if (this.isSuperAdmin === false){
      throw new Error("You are not authorized to do this action.");
    }
    this.loading = true;
    return agent.Users
      .getAllUsers()
      .then(action((users) => {
        this.clearUsers();
        this.users = users.result.map(this.parseUser);
        console.log('loadAllUsers', this.users);
      }))
      .catch(action((err) => {
        this.loading = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.loading = false;
      }));
  }

  @action deleteUser(){
    this.deletingUser = true;
    return agent.Users
      .deleteUser(this.deleteUserId)
      .catch(action((err) => {
        this.deletingUser = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.deletingUser = false;
        this.users = this.users.filter((user) => {
          return (user.userId.toString() !== this.deleteUserId.toString());
        });
        this.deleteUserId = '';
        messagingStore.successfullyDeletedUser = true;
      }));
  }

  clearUsers(){
    this.users = [];
  }

  parseUser(user){
    console.log('userStore user', user);
    return new User(
      user._id,
      user.firstName,
      user.lastName,
      user.email,
      user.userType,
      user.groups
    );
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
        this.loading = false;
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
