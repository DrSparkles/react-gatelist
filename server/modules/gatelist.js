import { db, returnSimpleResult, returnSimpleError, getId } from '../lib/db';
import settings from './settings';
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

    console.log('create new', userId, gatelistValues);

    const { firstName, lastName, date, minor, notes, groupId, groupName } = gatelistValues;

    if (firstName === undefined || firstName === '' ||
        lastName === undefined || lastName === '' ||
        date === undefined || date === '' ||
        minor === undefined || minor === '' ||
        groupId === undefined || groupId === '' ||
        groupName === undefined || groupName === ''
    ){
      console.log('createNew exiting due to empty values');
      return returnSimpleError("all fields are required.", 400, cb);
    }

    console.log('moment', moment().unix());
    const groupObjId = getId(groupId);
    const addedByObjId = getId(userId);
    const insertQuery = {
      groupId: groupObjId,
      groupName,
      firstName,
      lastName,
      date: date,
      minor,
      addedBy: addedByObjId,
      notes,
      createdDate: moment().unix()
    };

    console.log('insertQuery', insertQuery);

    this.gatelists_collection.insert(insertQuery, (err, doc) => {
      if (err) {
        console.log('exiting due to insert error');
        return returnSimpleError(err, 400, cb);
      }
      return returnSimpleResult(null, doc, cb);
    });

  }

  /**
   * Get gatelist by week and sort by groupName
   * @param week
   * @param cb
   */
  getGatelistByWeek(week, cb){

    const query = {date: week};
    const sort = {sort: {groupName: 1, lastName: 1}};
    console.log('query', query);
    this.gatelists_collection.find(query, sort, (err, docs) => {
      if (err) return returnSimpleError(err, 400, cb);

      const gatelist = {};
      for (let i = 0; i < docs.length; i++){
        const glEntry = docs[i];

        if (gatelist[glEntry.date] === undefined){
          gatelist[glEntry.date] = [];
        }

        gatelist[glEntry.date].push(glEntry);
      }

      return returnSimpleResult(null, gatelist, cb);
    });

  }

  /**
   * Get a specific user's gatelists
   * @param groupId
   * @param cb
   */
  getGroupsGatelists(groupId, cb){
    const query = {groupId: getId(groupId)};
    console.log('query', query);
    this.gatelists_collection.find(query, (err, docs) => {
      if (err) return returnSimpleError(err, 400, cb);

      const gatelist = {};
      for (let i = 0; i < docs.length; i++){
        const glEntry = docs[i];

        if (gatelist[glEntry.date] === undefined){
          gatelist[glEntry.date] = [];
        }

        gatelist[glEntry.date].push(glEntry);
      }

      return returnSimpleResult(null, gatelist, cb);
    });
  }

  /**
   * Get a specific user's gatelists
   * @param groupId
   * @param weekNum
   * @param cb
   */
  getGroupsGatelistsByWeek(groupId, weekNum, cb){

    settings.getSiteSettings((err, sets) => {
      if (err) return returnSimpleError(err, 400, cb);
      const currentWeekStart = sets.result[0].startWeekend;
      const queryWeekStart = moment(currentWeekStart).add(weekNum, 'weeks').format('YYYY-MM-DD');
      const queryWeekEnd = moment(currentWeekStart).add((weekNum + 1), 'weeks').format('YYYY-MM-DD');
      const query = {groupId: getId(groupId), date: {$gte: queryWeekStart, $lt: queryWeekEnd}};
      console.log('query', query);
      this.gatelists_collection.find(query, (err, docs) => {
        if (err) return returnSimpleError(err, 400, cb);
        return returnSimpleResult(null, docs, cb);
      });
    });

  }

  /**
   * Get a specific user's gatelists
   * @param userId
   * @param cb
   */
  getUsersGatelists(userId, cb){
    const query = {addedBy: getId(userId)};
    console.log('query', query);
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

    const { firstName, lastName, date, minor, notes, groupId, addedBy } = values;
    // console.log('update gatelist values', values);

    if (gatelistId === undefined || gatelistId === '' ||
        firstName === undefined || firstName === '' ||
        lastName === undefined || lastName === '' ||
        date === undefined || date === '' ||
        minor === undefined || (minor !== true && minor !== false) ||
        groupId === undefined || groupId === ''
    ){
      // console.log('updateGatelist exiting due to empty values');
      return returnSimpleError("all fields are required.", 400, cb);
    }

    // console.log('moment', moment().unix());
    const addedByObjId = getId(addedBy);
    const editQuery = {
      firstName,
      lastName,
      date: date,
      minor,
      addedBy: addedByObjId,
      notes
    };

    // console.log('editQuery', editQuery);

    const query = {_id: getId(gatelistId)};
    const updateQuery = {
      $set: editQuery
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