import { db, returnSimpleResult, returnSimpleError, getId } from '../lib/db';

class Settings {

  constructor(){
    this.settings_collection = db.get('settings');
  }

  getSiteSettings(cb){

    this.settings_collection.find({}, (err, docs) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(null, docs, cb);
    });
  }

  /**
   * Fetch a setting by a specific key, which is be passed in
   * @param key
   * @param value
   * @param cb
   */
  getSettingByKeyValue(key, value, cb){

    const query = {};
    if (key === 'settingId' || key === 'settingId'){
      query[key] = getId(value);
    }
    else {
      query[key] = value;
    }

    this.settings_collection.find(query, (err, docs) => {
      if (err) return returnSimpleError(err, 400, cb);

      return returnSimpleResult(null, docs, cb);
    });
  }

  /**
   * Update setting.  The entire setting object is updated at once so special casing doesn't have to be
   * done to update specific fields - ergo all fields must be passed in through the values object
   * @param settingId
   * @param values
   * @param cb
   * @returns {*}
   */
  updateSetting(settingId, values, cb){

    const { startWeekend, numWeeks, defaultNumGLSlots } = values;

    console.log('settingId', settingId);
    console.log('updateSetting', values);

    if (settingId === undefined || settingId === '' ||
        startWeekend === undefined || startWeekend === '' ||
        numWeeks === undefined || numWeeks === '' ||
        defaultNumGLSlots === undefined || defaultNumGLSlots === ''){
      return returnSimpleError("Missing required information to edit settings", 400, cb);
    }

    const query = {_id: getId(settingId)};
    const updateQuery = {
      $set: {
        startWeekend: startWeekend,
        numWeeks: numWeeks,
        defaultNumGLSlots: defaultNumGLSlots
      }
    };

    console.log('updateQuery', updateQuery);

    this.settings_collection.update(query, updateQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });

  }

  /**
   * Delete setting
   * @param settingId
   * @param cb
   * @returns {*}
   */
  deleteSetting(settingId, cb){
    if (settingId === undefined || settingId === ""){
      return returnSimpleError("Must have a setting id to delete the entry.", 400, cb);
    }

    const settingObjId = getId(settingId);
    this.settings_collection.remove({_id: settingObjId}, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

  /**
   * Create the starting settings object
   * @param settingValues
   * @param cb
   * @returns {*}
   */
   createNew(settingValues, cb){
    const { startWeekend, numWeeks, defaultNumGLSlots } = settingValues;

    if (startWeekend === undefined || startWeekend === '' ||
        numWeeks === undefined || numWeeks === '' ||
        defaultNumGLSlots === undefined || defaultNumGLSlots === ''){
      return returnSimpleError("Missing required information to create settings", 400, cb);
    }

    const insertQuery = {
      startWeekend: startWeekend,
      numWeeks: numWeeks,
      defaultNumGLSlots: defaultNumGLSlots
    };

    this.settings_collection.insert(insertQuery, (err, doc) => {
      if (err) return returnSimpleError(err, 400, cb);
      return returnSimpleResult(err, doc, cb);
    });
  }

}

export default new Settings();