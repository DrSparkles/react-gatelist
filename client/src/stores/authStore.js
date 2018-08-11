import { observable, action } from 'mobx';
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
  @observable inProgress = false;

  /**
   * Container for any errors returned from the save process, used for
   * displaying on the front end
   * @type {undefined}
   */
  @observable errors = undefined;

  /**
   * Logged in user
   * @type {{firstName: string, lastName: string, email: string, password: string, groupName: string}}
   */
  @observable values = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    groupName: '',
    department: 'ent'
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
   * Setter for group name
   * @param {string} groupName
   */
  @action setGroupName(groupName) {
    this.values.groupName = groupName;
  }

  /**
   * Clear the logged in user, particularly for the sign in or registration form
   */
  @action reset() {
    this.values.firstName = '';
    this.values.lastName = '';
    this.values.email = '';
    this.values.password = '';
    this.values.groupName = '';
  }

  /**
   * Log the user in given the store values
   * @returns {Promise<any>}
   */
  @action login() {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth
      .login(this.values.email, this.values.password)
      .then ((userToken) => {
        commonStore.setToken(userToken.result.token);
      })
      .then(() => {
        userStore.pullUser();
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  /**
   * firstName, lastName, email, password, groupName
   * Register a new user given the store values
   * @returns {Promise<any>}
   */
  @action register() {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth
      .register(this.values.firstName, this.values.lastName, this.values.groupName, this.values.email, this.values.password, this.values.department)
      .then(( user ) => {
        commonStore.setToken(user.result.token);
      })
      .then(() => {
        userStore.pullUser();
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  /**
   * Log the user out, clearing the saved token and current user
   * @returns {Promise<void>}
   */
  @action logout() {
    commonStore.setToken(undefined);
    userStore.forgetUser();
    return Promise.resolve();
  }
}

export default new AuthStore();
