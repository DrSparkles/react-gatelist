import {db, returnSimpleResult, returnSimpleError, getIdFromJSON, getId} from '../lib/db';
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
   *    email: STRING,
   *    password: STRING
   * }
   * @param {object} userValues
   * @param cb
   * @returns {*}
   */
  createNew(userValues, cb){
    const { firstName, lastName, email, password } = userValues;

    // make sure our values are set
    if (firstName === undefined || firstName === "" ||
        lastName === undefined || lastName === "" ||
        email === undefined || email === "" ||
        password === undefined || password === ""){
      return returnSimpleError("all fields are required.", 400, cb);
    }

    // make sure the user is unique
    this.user_collection.find({email}, (err, userDoc) => {
      if (err) return returnSimpleError(err, 400, cb);

      if (userDoc.length){
        return returnSimpleError("That email already exists; please try another!", 400, cb);
      }

      // hash our password for security
      let hash = bcrypt.hashSync(password, 10);

      const insertQuery = {
        firstName,
        lastName,
        email,
        password: hash,
        userType: 'user',
      };

      // save our user with hashed password
      this.user_collection.insert(insertQuery, (err, doc) => {
        return returnSimpleResult(err, doc, cb);
      });
    });

  }

  saveUser(userId, originalUserData, newUesrData, cb){

    const { originalFirstName, originalLastName, originalEmail } = originalUserData;
    const { firstName, lastName, email, password, userType } = newUesrData;

    // make sure our values are set
    if (firstName === undefined || firstName === "" ||
        lastName === undefined || lastName === "" ||
        email === undefined || email === ""){
      return returnSimpleError("all fields are required.", 400, cb);
    }

    // make sure the user is unique
    this.user_collection.find({email: originalEmail}, (err, userDoc) => {

      if (err) return returnSimpleError(err, 400, cb);

      if (userDoc.length){
        return returnSimpleError("That email already exists; please try another!", 400, cb);
      }

      const insertQuery = {
        firstName,
        lastName,
        email
      };

      if (userType !== undefined){
        insertQuery.userType = userType;
      }

      if (password !== undefined){
        // hash our password for security
        insertQuery.password = bcrypt.hashSync(password, 10);
      }

      const query = {_id: getId(userId)};

      const updateQuery = {
        $set: insertQuery
      };

      this.user_collection.update(query, updateQuery, (err, doc) => {
        if (err) return returnSimpleError(err, 400, cb);
        return returnSimpleResult(err, doc, cb);
      });
    });
  }

  /**
   * Authenticate a user given email and password
   * {
   *    email: STRING,
   *    password: STRING
   * }
   * @param userValues
   * @param cb
   * @returns {*}
   */
  authenticate(userValues, cb){

    const { email, password } = userValues;

    // make sure our values are set
    if (email === undefined || email === "" || password === undefined || password === ""){
      return returnSimpleError("email and password must not be blank.", 400, cb);
    }

    // check to see if the email existss
    this.user_collection.findOne({email}, (err, userDoc) => {
      if (err) return returnSimpleResult(err, doc, cb);

      // and return if it does not exist
      if (!userDoc) return returnSimpleError("User " + email + " not found.", 400, cb);

      // else compare the hashed password to what was sent
      if(bcrypt.compareSync(password, userDoc.password)) {

        const payload = {
          _id: userDoc._id,
          email
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
    return this.getUserByEmail(payload, cb);
  }

  /**
   * Fetch a user by the email
   * @param email
   * @param cb
   */
  getUserByEmail(email, cb){
    this.user_collection.findOne({email: email.email}, ['_id', 'firstName', 'lastName', 'email', 'userType'], (err, user) => {
      if (!user) return returnSimpleError("User " + email + " not found.", 400, cb);
      return returnSimpleResult(err, {user}, cb)
    });
  }

  /**
   * Fetch all users
   * @param cb
   */
  getAll(cb){
    this.user_collection.find({}, ["_id", "email"], (err, docs) => {
      return returnSimpleResult(err, docs, cb);
    });
  }
}

export default new User();