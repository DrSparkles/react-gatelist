import { db, returnSimpleResult, returnSimpleError, getId } from '../lib/db';
import moment from "moment";
class Gatelist {

  constructor(){
    this.gatelists_collection = db.get('gatelists');
  }

  /**
   * Create a new gatelist after checking that all required values are present and a user
   * with that name doesn't already exist
   * @param userId
   * @param gatelistValues
   * @param cb
   * @returns {*}
   */
  createNew(userId, gatelistValues, cb){
    const { firstName, lastName, date, minor, notes, groupId, addedBy } = gatelistValues;

    if (firstName === undefined || firstName === '' ||
        lastName === undefined || lastName === '' ||
        date === undefined || date === '' ||
        minor === undefined || minor === '' ||
        groupId === undefined || groupId === '' ||
        addedBy === undefined || addedBy === ''
    ){
      return returnSimpleError("all fields are required.", 400, cb);
    }

    console.log('moment', moment().unix());

    const insertQuery = {
      groupId: getId(groupId),
      firstName,
      lastName,
      date,
      minor,
      addedBy,
      notes,
      createdDate: moment().unix()
    };

    this.gatelists_collection.insert(insertQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(null, doc, cb);
    });

  }

  /**
   * Get a specific user's gatelists
   * @param userId
   * @param cb
   */
  getUsersGatelists(userId, cb){
    const query = {userId: getId(userId)};
    this.gatelists_collection.find(query, (err, docs) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(null, docs, cb);
    });
  }

  /**
   * Fetch a gatelist by a specific key, which is be passed in
   * @param key
   * @param value
   * @param cb
   */
  getGatelistByKeyValue(key, value, cb){

    const query = {};
    if (key === 'userId' || key === 'userId'){
      query[key] = getId(value);
    }
    else {
      query[key] = value;
    }

    this.gatelists_collection.find(query, (err, docs) => {
      if (err) return returnSimpleError(err, 400, cb);

      return returnSimpleResult(null, docs, cb);
    });
  }

  /**
   * Update gatelist.  The entire gatelist object is updated at once so special casing doesn't have to be
   * done to update specific fields - ergo all fields must be passed in through the values object
   * @param gatelistId
   * @param values
   * @param cb
   * @returns {*}
   */
  updateGatelist(gatelistId, values, cb){

    const { gatelistName, numGLSlots, userId } = values;

    if (gatelistId === undefined || gatelistId === '' ||
      gatelistName === undefined || gatelistName === '' ||
      numGLSlots === undefined || numGLSlots === '' ||
      userId === undefined || userId === ''){
      return returnSimpleError("Missing required information to edit gatelist", 400, cb);
    }

    const query = {_id: getId(gatelistId)};
    const updateQuery = {
      $set: {
        gatelistName: gatelistName,
        numGLSlots: numGLSlots,
        userId: userId
      }
    };
    this.gatelists_collection.update(query, updateQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });

  }

  /**
   * Delete gatelist
   * @param gatelistId
   * @param cb
   * @returns {*}
   */
  deleteGatelist(gatelistId, cb){
    if (gatelistId === undefined || gatelistId === ""){
      return returnSimpleError("Must have a gatelist id to delete the entry.", 400, cb);
    }

    const gatelistObjId = getId(gatelistId);
    this.gatelists_collection.remove({_id: gatelistObjId}, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

}

export default new Gatelist();