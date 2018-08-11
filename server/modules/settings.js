import { db, returnSimpleResult, returnSimpleError, getId } from '../lib/db';

/**
 * Handle settings
 */
class Settings {

  constructor(){
    this.task_collection = db.get('settings');
  }

  /**
   * Fetch settings from the database
   * @param cb
   * @returns {*}
   */
  getAllSettings(cb){

    this.task_collection.find({}, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });

  }

  updateSetting(settingName, settingValue, cb){

    // const query = {_id: getId(listId)};
    const updateQuery = {
      $set: {listname: listData.listname}
    };
    this.task_collection.update(query, updateQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  deleteSetting(listId, cb){
    // if no userId error out
    if (listId === undefined || listId === ""){
      return returnSimpleError("Must have a list id to delete the entries.", 400, cb);
    }

    // else return our data
    const listObjectId = getId(listId);
    this.task_collection.remove({_id: listObjectId}, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }


  /**
   * Create a list for a given user
   * {
   *    listname: STRING
   * }
   * @param userId
   * @param listValues
   * @param cb

   createNew(userId, listValues, cb){

    if (userId === undefined || userId === ""){
      return returnSimpleError("Must have a user id to create a new list.", 400, cb);
    }

    if (listValues.listname === undefined || listValues.listname === ""){
      return returnSimpleError("Must have a list name to create a new list.", 400, cb);
    }

    const { listname } = listValues;
    const userObjectId = getId(userId);

    const listQuery = {
      userId: userObjectId,
      listname: listname,
      tasks: []
    };
    this.task_collection.insert(listQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }
   */
}

export default new Settings();