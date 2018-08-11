import { dbConfig } from '../../config/db.config';
const fixtures = require('pow-mongodb-fixtures').connect(dbConfig.test.host);
import requireDirectory from 'require-directory';

const fixtureData = requireDirectory(module);

export function clearAllAndLoad(cb){
  return fixtures.clearAllAndLoad(fixtureData, cb);
};

export function clearAndLoad(collection, cb){
  return fixtures.clearAndLoad(fixtureData[collection], cb);
};

export function loadAll(cb){
  return fixtures.load(fixtureData, cb);
};

export function loadSpecific(fixture, cb){
  return fixtures.load(fixtureData[fixture], cb);
};

export function clearDB(cb){
  return fixtures.clear(cb);
};

export function clearCollection(collection, cb){
  return fixtures.clear(collection, cb);
};