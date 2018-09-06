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

  @observable editingUser = false;

  @observable userForEdit = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: ''
  };

  @action loadSelectedUser(userId){
    console.log('loadSelectedUser userId', userId);
    const user = this.users.filter((u) => {
      console.log('u.userId === userId', u.userId === userId);
      return u.userId === userId;
    });

    console.log('user', user);
    if (user.length && user.length === 1){
      console.log('userObj', this.getUserObject(user[0]));
      this.userForEdit = this.getUserObject(user[0]);
    }

    return this.userForEdit;
  }

  @action setEditingUserFromCurrentUser(){
    this.userForEdit.userId = this.currentUser.userId;
    this.userForEdit.firstName = this.currentUser.firstName;
    this.userForEdit.lastName = this.currentUser.lastName;
    this.userForEdit.email = this.currentUser.email;
    this.userForEdit.userType = this.currentUser.userType;
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

  getUserTypeLabel(userType){
    const userTypes = {
      user: 'User',
      admin: 'Admin',
      superadmin: 'Super Admin'
    };
    return userTypes[userType];
  }

  @action loadAllUsers(){
    if (this.isSuperAdmin === false){
      throw new Error("You are not authorized to do this action.");
    }
    this.loading = true;
    return agent.Users
      .getAllUsers()
      .then(action('loadAllUsers then',(users) => {
        this.clearUsers();
        this.users = users.result.map(this.parseUser);
        console.log('loadAllUsers', this.users);
      }))
      .catch(action('loadAllUsers error', (err) => {
        this.loading = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('loadAllUsers finally', () => {
        this.loading = false;
      }));
  }

  @action deleteUser(){
    this.deletingUser = true;
    return agent.Users
      .deleteUser(this.deleteUserId)
      .catch(action('deleteUser error', (err) => {
        this.deletingUser = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('deleteUser finally', () => {
        this.deletingUser = false;
        this.users = this.users.filter((user) => {
          return (user.userId.toString() !== this.deleteUserId.toString());
        });
        this.deleteUserId = '';
        messagingStore.successfullyDeletedUser = true;
      }));
  }

  @action clearUsers(){
    this.users = [];
  }

  @action parseUser(user){
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

      this.currentUser = this.getUserObject(results.user.result.user);

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
      userId: this.userForEdit.userId,
      firstName: this.userForEdit.firstName,
      lastName: this.userForEdit.lastName,
      email: this.userForEdit.email
    };

    if (this.userForEdit.userType){
      user.userType = this.userForEdit.userType;
    }

    if (this.userForEdit.password !== ''){
      user.password = this.userForEdit.password;
    }
    console.log('this.userForEdit', this.userForEdit);
    console.log('this.currentUser', this.currentUser);
    return agent.Users
      .save(this.currentUser.userId, this.currentUser, user)
      .catch(action('saveUser error', (err) => {
        this.loading = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('saveUser finally', () => {
        this.pullUser()
          .finally(action('saveUser finally pullUser finally', () => {
            this.setEditingUserFromCurrentUser();
            this.loading = false;
          }));
      }));
  }

  @action adminEditUser(){
    this.loading = true;
    const user = {
      userId: this.userForEdit.userId,
      firstName: this.userForEdit.firstName,
      lastName: this.userForEdit.lastName,
      email: this.userForEdit.email
    };

    if (this.userForEdit.userType){
      user.userType = this.userForEdit.userType;
    }

    console.log('this.userForEdit', this.userForEdit);
    console.log('this.currentUser', this.currentUser);

    return agent.Users
      .adminEdit(this.userForEdit.userId, user)
      .catch(action('saveUser error', (err) => {
        this.loading = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('saveUser finally', () => {
        this.loadAllUsers()
          .finally(action('saveUser finally pullUser finally', () => {
            this.loading = false;
          }));
      }));
  }

  getUserObject(userData){
    const currentUser = {};
    currentUser.userId = (userData._id) ? userData._id : userData.userId;
    currentUser.firstName = userData.firstName;
    currentUser.lastName = userData.lastName;
    currentUser.email = userData.email;
    currentUser.userType = userData.userType;
    return currentUser;
  }

  @action clearEditingUser(){
    this.userForEdit = {
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
