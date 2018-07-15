import dbConfig from '../config/db.config';
import mongo from 'mongodb';
import monk from 'monk';

/**
 * Connect to our database
 * @type {Promise<"monk".IMonkManager> & "monk".IMonkManager}
 */
export const db = monk(dbConfig.connection);

/**
 * Given an id in a json object, return an ObjectId
 * The object should be a collection of values containing _id
 * @param {object} obj
 */
export function getIdFromJSON(obj){
  return db.id(obj._id);
}

/**
 * Get an ObjectId from a string
 * @param {string} id
 */
export function getId(id = ""){
  if (id !== ""){
    return db.id(id);
  }
  return db.id();
}

/**
 * Format return data for sending
 * @param values
 * @param isError
 * @returns {{error: boolean, result: *}}
 */
export function getResponseJSON(values, isError = false){
  return {
    error: isError,
    result: values
  };
}

/**
 * Handle errors
 * @param err
 * @param res
 * @returns {*}
 */
export function errorHandler(err, res) {
  res.status(err.status || 500);
  return res.json({
    message: err.message,
    error: err
  });
}

/**
 * Error will either be a custom string, an array of error strings, or an error object passed from some action.
 * If it's a string or array, create a new error, set the status, and return via callback
 * else just pass the error on to the callback with a status attached.
 * @param err
 * @param status
 * @param cb
 * @returns {*}
 */
export function returnSimpleError(err, status, cb){
  if (typeof err === "function"){
    err.status = status;
    return cb(err);

  }
  else {
    const error = Error(err);
    error.status = status;
    return cb(error);
  }
}

/**
 * Return a result
 * If an error is passed in, return that
 * Else return a successful result
 * @param err
 * @param doc
 * @param cb
 * @returns {*}
 */
export function returnSimpleResult(err, doc, cb){
  if (err){
    return cb(err);
  }

  return cb(null, getResponseJSON(doc));
}