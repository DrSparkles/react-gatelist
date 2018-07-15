import { db, returnSimpleResult, returnSimpleError, getIdFromJSON } from '../lib/db';
import authConfig from '../config/auth.config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Handle user auth
 */
class User {

  constructor(){
    this.user_collection = db.get('users');
  }

  /**
   * Create a new user in the system
   * {
   *    username: STRING,
   *    password: STRING
   * }
   * @param {object} userValues
   * @param cb
   * @returns {*}
   */
  createNew(userValues, cb){
    const { username, password } = userValues;

    // make sure our values are set
    if (username === undefined || username === "" || password === undefined || password === ""){
      return returnSimpleError("Username and password must not be blank.", 400, cb);
    }

    // make sure the user is unique
    this.user_collection.find({username}, (err, userDoc) => {
      if (err) return returnSimpleError(err, 400, cb);

      if (userDoc.length){
        return returnSimpleError("That username already exists; please try another!", 400, cb);
      }

      // save our user with hashed password
      let hash = bcrypt.hashSync(password, 10);
      this.user_collection.insert({username, password: hash}, (err, doc) => {
        return returnSimpleResult(err, doc, cb);
      });
    });

  }

  /**
   * Authenticate a user given username and password
   * {
   *    username: STRING,
   *    password: STRING
   * }
   * @param userValues
   * @param cb
   * @returns {*}
   */
  authenticate(userValues, cb){

    const { username, password } = userValues;

    // make sure our values are set
    if (username === undefined || username === "" || password === undefined || password === ""){
      return returnSimpleError("Username and password must not be blank.", 400, cb);
    }

    // check to see if the username existss
    this.user_collection.findOne({username}, (err, userDoc) => {
      if (err) return returnSimpleResult(err, doc, cb);

      // and return if it does not exist
      if (!userDoc) return returnSimpleError("User " + username + " not found.", 400, cb);

      // else compare the hashed password to what was sent
      if(bcrypt.compareSync(password, userDoc.password)) {

        const payload = {
          _id: userDoc._id,
          username
        };

        // return the token
        const token = jwt.sign(payload, authConfig.secret);

        return returnSimpleResult(err, {token}, cb);
      }

      // error out if the password doesn't match
      else {
        return returnSimpleError("Password does not match our records.", 400, cb);
      }

    });
  }

  /**
   * Given a token, fetch the user
   * @param {string} userToken
   * @param cb
   * @returns {*}
   */
  getUserByToken(userToken, cb){
    const payload = jwt.decode(userToken);
    if (!payload){
      return returnSimpleError("Could not derive user from auth token.", 400, cb);
    }
    return this.getUserByUsername(payload, cb);
  }

  /**
   * Fetch a user by the username
   * @param username
   * @param cb
   */
  getUserByUsername(username, cb){
    this.user_collection.findOne({username: username.username}, ['_id', 'username'], (err, user) => {
      if (!user) return returnSimpleError("User " + username + " not found.", 400, cb);
      return returnSimpleResult(err, {user}, cb)
    });
  }

  /**
   * Fetch all users
   * @param cb
   */
  getAll(cb){
    this.user_collection.find({}, ["_id", "username"], (err, docs) => {
      return returnSimpleResult(err, docs, cb);
    });
  }
}

export default new User();