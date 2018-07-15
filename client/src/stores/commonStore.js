import { observable, action, reaction } from 'mobx';

/**
 * Application state
 */
class CommonStore {

  /**
   * Application name
   * @type {string}
   */
  @observable appName = 'NCRF Gatelist';

  /**
   * User logged in token
   * @type {string | null}
   */
  @observable token = window.localStorage.getItem('jwt');

  /**
   * Has the app loaded all required data?
   * @type {boolean}
   */
  @observable appLoaded = false;

  /**
   * Format string for dates, per the moment.js library
   * @type {string}
   */
  @observable datetimeFormat = 'YYYY-MM-DD';

  /**
   * Set up critical app sate
   */
  constructor() {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        }
        else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }

  /**
   * Token setter
   * @param {string} token
   */
  @action setToken(token) {
    this.token = token;
  }

  /**
   * App loaded setter.  Can only set to true because if the app isn't loaded it's inherently false
   */
  @action setAppLoaded() {
    this.appLoaded = true;
  }

}

export default new CommonStore();
