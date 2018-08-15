import { db, returnSimpleResult, returnSimpleError, getId } from '../lib/db';

class Groups {

  constructor(){
    this.groups_collection = db.get('groups');
  }

  /**
   * Create a new group after checking that all required values are present and a user
   * with that name doesn't already exist
   * @param userId
   * @param groupValues
   * @param cb
   * @returns {*}
   */
  createNew(userId, groupValues, cb){
    const { groupName, numGLSlots, department } = groupValues;

    if (userId === undefined || userId === '' ||
        groupName === undefined || groupName === '' ||
        numGLSlots === undefined || numGLSlots === '' ||
        department === undefined || department === ''){
      return returnSimpleError("all fields are required.", 400, cb);
    }

    this.groups_collection.find({groupName}, (err, groupsDoc) => {

      if (err) return returnSimpleError(err, 400, cb);

      if (groupsDoc.length){
        return returnSimpleError("That group already exists!", 400, cb);
      }

      const insertQuery = {
        userId: getId(userId),
        groupName,
        numGLSlots,
        department
      };

      this.groups_collection.insert(insertQuery, (err, doc) => {
        if (err) return returnSimpleError(err, 400, cb);
        return returnSimpleResult(null, doc, cb);
      });

    });
  }

  /**
   * Get a specific user's groups
   * @param userId
   * @param cb
   */
  getUsersGroups(userId, cb){
    const query = {userId: getId(userId)};
    this.groups_collection.find(query, (err, docs) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(null, docs, cb);
    });
  }

  /**
   * Fetch a group by a specific key, which is be passed in
   * @param key
   * @param value
   * @param cb
   */
  getGroupByKeyValue(key, value, cb){

    const query = {};
    if (key === 'userId' || key === 'userId'){
      query[key] = getId(value);
    }
    else {
      query[key] = value;
    }

    this.groups_collection.find(query, (err, docs) => {
      if (err) return returnSimpleError(err, 400, cb);

      return returnSimpleResult(null, docs, cb);
    });
  }

  /**
   * Update group.  The entire group object is updated at once so special casing doesn't have to be
   * done to update specific fields - ergo all fields must be passed in through the values object
   * @param groupId
   * @param values
   * @param cb
   * @returns {*}
   */
  updateGroup(groupId, values, cb){

    const { groupName, numGLSlots, userId } = values;

    if (groupId === undefined || groupId === '' ||
        groupName === undefined || groupName === '' ||
        numGLSlots === undefined || numGLSlots === '' ||
        userId === undefined || userId === ''){
      return returnSimpleError("Missing required information to edit group", 400, cb);
    }

    const query = {_id: getId(groupId)};
    const updateQuery = {
      $set: {
        groupName: groupName,
        numGLSlots: numGLSlots,
        userId: userId
      }
    };
    this.groups_collection.update(query, updateQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });

  }

  /**
   * Delete group
   * @param groupId
   * @param cb
   * @returns {*}
   */
  deleteGroup(groupId, cb){
    if (groupId === undefined || groupId === ""){
      return returnSimpleError("Must have a group id to delete the entry.", 400, cb);
    }

    const groupObjId = getId(groupId);
    this.groups_collection.remove({_id: groupObjId}, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

}

export default new Groups();