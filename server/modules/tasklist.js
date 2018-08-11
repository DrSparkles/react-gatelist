import { db, returnSimpleResult, returnSimpleError, getId } from '../lib/db';

/**
 * Handle user auth
 */
class Settings {

  constructor(){
    this.task_collection = db.get('settings');
  }

  /**
   * Create a list for a given user
   * {
   *    listname: STRING
   * }
   * @param userId
   * @param listValues
   * @param cb
   */
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

  /**
   * This is for testing
   * @param userId
   * @param cb
   * @returns {*}
   */
  getAllLists(cb){
    this.task_collection.find({}, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  getUsersLists(userId, cb){
    // if no userId error out
    if (userId === undefined || userId === ""){
      return returnSimpleError("Must have a user id to fetch their entries.", 400, cb);
    }

    // else return our data
    const userObjectId = getId(userId);
    this.task_collection.find({userId: userObjectId}, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  getList(listId, cb){
    // if no userId error out
    if (listId === undefined || listId === ""){
      return returnSimpleError("Must have a list id to fetch the entries.", 400, cb);
    }

    // else return our data
    const listObjectId = getId(listId);
    this.task_collection.find({_id: listObjectId}, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  updateList(listId, userId, listData, cb){
    if (listId === undefined || listId === ""){
      return returnSimpleError("Must have an id to update an entry.", 400, cb);
    }

    if (listData.listname === undefined || listData.listname === ""){
      return returnSimpleError("Must have a list name to update an entry.", 400, cb);
    }

    const query = {_id: getId(listId)};
    const updateQuery = {
      $set: {listname: listData.listname}
    };
    this.task_collection.update(query, updateQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  deleteList(listId, cb){
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
}

export default new TaskList();