import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import commonStore from './stores/commonStore';
import authStore from './stores/authStore';

const superagent = superagentPromise(_superagent, global.Promise);
const API_ROOT = '/api';

/**
 * Middleware to handle specific status errors
 * If 401 (not authorized) log the user out
 * @param err
 * @returns {*}
 */
const handleErrors = err => {
  if (err && err.response && err.response.status === 401) {
    authStore.logout();
  }
  return err;
};

/**
 * Extract the payload from the server response
 * @param res
 * @returns {any}
 */
const responseBody = res => {
  return JSON.parse(res.text);
};

/**
 * Simple testing function to examine payloads
 * @param res
 * @returns {any}
 */
const responseBodyTesting = res => {
  console.log("DBAGENT TESTING res.text", JSON.parse(res.text));
  console.log("RES", res);
  return JSON.parse(res.text);
};

/**
 * Set up superagent to use token authentication
 * @param req
 */
const tokenPlugin = req => {
  if (commonStore.token) {
    req.set('x-access-token', commonStore.token);
  }
};

/**
 * Simplify the actual requests by standardizing each REST behavior, setting up superagent
 * with required plugins and error handlers.
 * @type {{del: function(*), get: function(*), put: function(*, *=), post: function(*, *=)}}
 */
const requests = {
  del: url => {
    return superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody);
  },
  get: url => {
    return superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody);
  },
  put: (url, body) => {
    return superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody);
  },
  post: (url, body) => {
    return superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody);
  },
};

/**
 * Auth routes
 * @type {{current: function(), login: function(*=, *=), register: function(*, *), save: function(*)}}
 */
const Auth = {
  current: () => {
    return requests.get('/users/user')
  },
  login: (email, password) => {
    return requests.post('/users/authenticate', { email, password })
  },
  register: (firstName, lastName, groupName, email, password) => {
    return requests.post('/users', { firstName, lastName, groupName, email, password })
  },
  save: user => {
    return requests.put('/user', { user })
  }
};

const List = {
  createNew: (saveData) => {
    return requests.post('/lists', saveData);
  },
  getAllForUser: () => {
    return requests.get('/lists');
  },
  getEntry: (listId) => {
    const url = "/lists/" + listId;
    return requests.get(url);
  },
  editEntry: (listId, saveData) => {
    const url = '/lists/' + listId;
    return requests.put(url, saveData);
  },
  deleteEntry: (listId) => {
    const url = "/lists/" + listId;
    return requests.del(url);
  }
};

const Task = {
  createNew: (listId, saveData) => {
    const url = "/lists/" + listId + "/tasks";
    return requests.post(url, saveData);
  },
  editEntry: (listId, taskId, saveData) => {
    const url = '/lists/' + listId + "/tasks/" + taskId;
    return requests.put(url, saveData);
  },
  deleteEntry: (listId, taskId) => {
    const url = "/lists/" + listId + "/tasks/" + taskId;
    return requests.del(url);
  }
};

/**
 * Blood Pressure routes
 * @type {{getAll: function(), getAllForUser: function(*), getEntry: function(*), createNew: function(*=), editEntry: function(*=), deleteEntry: function(*)}}

const BP = {
  getAll: () => {
    return requests.get('/bp');
  },
  getAllForUser: (userId) => {
    const url = '/bp/user/' + userId;
    return requests.get(url);
  },
  getEntry: (bpId) => {
    const url = "/bp/" + bpId;
    return requests.get(url);
  },
  createNew: (saveData) => {
    return requests.post('/bp', saveData);
  },
  editEntry: (saveData) => {
    const url = '/bp/' + saveData._id;
    return requests.put(url, saveData);
  },
  deleteEntry: (_id) => {
    const url = '/bp/' + _id;
    return requests.del(url);
  }
};
 */

export default {
  Auth,
  List,
  Task
};