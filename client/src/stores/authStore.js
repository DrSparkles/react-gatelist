import { observable, action, computed } from 'mobx';
import agent from '../agent';
import userStore from './userStore';
import commonStore from './commonStore';

/**
 * Store for handling user auth
 */
class AuthStore {

  /**
   * Progress value for loading from the db
   * @type {boolean}
   */
  @observable loading = false;

  @observable userLoggedIn = false;

  @observable userJustRegistered = false;

  @action setUserLoggedIn(loggedInState){
    this.userLoggedIn = loggedInState;
  }

  @computed get isLoggedIn(){
    return this.userLoggedIn;
  }

  /**
   * Container for any errors returned from the save process, used for
   * displaying on the front end
   * @type {undefined}
   */
  @observable errors = undefined;

  /**
   * Logged in user
   * @type {{firstName: string, lastName: string, email: string, password: string}}
   */
  @observable values = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  /**
   * Set first name
   * @param {string} firstName
   */
  @action setFirstName(firstName){
    this.values.firstName = firstName;
  }

  /**
   * Set last name
   * @param {string} lastName
   */
  @action setLastName(lastName){
    this.values.lastName = lastName;
  }

  /**
   * Setter for email
   * @param {string} email
   */
  @action setEmail(email) {
    this.values.email = email;
  }

  /**
   * Setter for password
   * @param {string} password
   */
  @action setPassword(password) {
    this.values.password = password;
  }

  /**
   * Clear the logged in user, particularly for the sign in or registration form
   */
  @action reset() {
    this.values.firstName = '';
    this.values.lastName = '';
    this.values.email = '';
    this.values.password = '';
  }

  /**
   * Log the user in given the store values
   * @returns {Promise<any>}
   */
  @action login() {
    this.loading = true;
    this.errors = undefined;
    return agent.Auth
      .login(this.values.email, this.values.password)
      .then (action('login then 1', (userToken) => {
        commonStore.setToken(userToken.result.token);
      }))
      .then(action('login then 2', () => {
        userStore.pullUser();
      }))
      .catch(action('login error', (err) => {
        this.loading = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('login finally', () => {
        this.loading = false;
      }));
  }

  /**
   * firstName, lastName, email, password, groupName
   * Register a new user given the store values
   * @returns {Promise<any>}
   */
  @action register() {
    this.loading = true;
    this.errors = undefined;
    return agent.Auth
      .register(this.values.firstName, this.values.lastName, this.values.email, this.values.password)
      .then(action('register then', (user) => {
        commonStore.setToken(user.result.token);
      }))
      .then(action('register then', () => {
        // userStore.pullUser();
      }))
      .catch(action('register error',(err) => {
        this.loading = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('register finally', () => {
        this.loading = false;
        this.userJustRegistered = true;
      }));
  }

  /**
   * Log the user out, clearing the saved token and current user
   * @returns {Promise<void>}
   */
  @action logout() {
    commonStore.setToken(undefined);
    userStore.forgetUser();
    this.setUserLoggedIn(false);
    return Promise.resolve();
  }
}

export default new AuthStore();
