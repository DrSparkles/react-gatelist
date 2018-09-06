import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import commonStore from './stores/commonStore';
import authStore from './stores/authStore';
import async from 'async';


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

const responseBodyTesting = res => {
  console.log("DBAGENT TESTING res.text", JSON.parse(res.text));
  console.log("RES", res);
  return JSON.parse(res.text);
};
 */

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
 * Auth
 * @type {{current: (function(): *), login: (function(*, *): *), register: (function(*, *, *, *): *), save: (function(*): *)}}
 */
const Auth = {
  current: () => {
    return requests.get('/users/user')
  },
  login: (email, password) => {
    return requests.post('/users/authenticate', { email, password })
  },
  register: (firstName, lastName, email, password) => {
    return requests.post('/users', { firstName, lastName, email, password })
  }
};

const Users = {
  save: (userId, originalUser, newUser) => {
    const url = "/users/" + userId;
    return requests.put(url, { originalUser, newUser });
  },
  adminEdit: (userId, userData) => {
    const url = "/users/admin/" + userId;
    return requests.put(url, userData);
  },
  getAllUsers: () => {
    const url = "/users";
    return requests.get(url);
  },
  deleteUser: (userId) => {
    const url = "/users/" + userId;
    return requests.del(url);
  }
};

const Groups = {
  createNew: (saveData) => {
    return requests.post('/groups', saveData);
  },
  getUsersGroups: () => {
    const url = "/groups";
    return requests.get(url);
  },
  getAllGroups: () => {
    const url = "/groups/all";
    return requests.get(url);
  },
  getGroup: (groupId) => {
    const url = "/groups/" + groupId;
    return requests.get(url);
  },
  editGroup: (groupId, saveData) => {
    const url = "/groups/" + groupId;
    return requests.put(url, saveData);
  },
  deleteGroup: (groupId) => {
    const url = "/groups/" + groupId;
    return requests.del(url);
  }
};

const Settings = {
  getSiteSettings: () => {
    const url = "/settings";
    return requests.get(url);
  },
  getSetting: (settingId) => {
    const url = "/settings/" + settingId;
    return requests.get(url);
  },
  editSettings: (settingId, saveData) => {
    const url = "/settings/" + settingId;
    return requests.put(url, saveData);
  },
  deleteSetting: (settingId) => {
    const url = "/settings/" + settingId;
    return requests.del(url);
  }
};

const Gatelist = {
  getGatelist: () => {
    const url = "/gatelist";
    return requests.get(url);
  },
  getUserGatelist: (userId) => {
    const url = "/gatelist/user/" + userId;
    return requests.get(url);
  },
  getGatelistForWeek: (week) => {
    const url = "/gatelist/week/" + week;
    return requests.get(url);
  },
  getGroupsGatelist: (groupId) => {
    const url = "/gatelist/group/" + groupId;
    return requests.get(url);
  },
  saveGatelist: (data) => {
    const url = "/gatelist";
    return requests.post(url, data);
  },
  editGatelist: (gatelistId, data) => {
    const url = "/gatelist/" + gatelistId;
    return requests.put(url, data);
  },
  deleteGatelist: (gatelistId) => {
    const url = "/gatelist/" + gatelistId;
    return requests.del(url);
  }
};

const SettingsData = (callback) => {
  async.parallel({
    user: (cb) => {
      Auth.current()
        .then((user) => {
          return cb(null, user);
        });
    },
    settings: (cb) => {
      Settings.getSiteSettings()
        .then((settings) => {
          return cb(null, settings);
        });
    },
    groups: (cb) => {
      Groups.getUsersGroups()
        .then((groups) => {
          return cb(null, groups);
        });
    }
  }, (err, results) => {
    return callback(err, results);
  });
};

export default {
  Auth,
  Groups,
  Settings,
  Gatelist,
  Users,
  SettingsData
};