// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'mobx-react';
// import { HashRouter } from 'react-router-dom';

import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from "./components/pages/Layout";

import commonStore from './stores/commonStore';
import authStore from './stores/authStore';
import userStore from './stores/userStore';
import groupStore from './stores/groupStore';
import settingStore from './stores/settingStore';
import gatelistStore from './stores/gatelistStore';

const browserHistory = createBrowserHistory();
const routerStore = new RouterStore();

const history = syncHistoryWithStore(browserHistory, routerStore);

const stores = {
  commonStore,
  authStore,
  userStore,
  groupStore,
  settingStore,
  gatelistStore,
  routerStore
};

const app = document.getElementById("root");

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <Layout stores={stores} />
    </Router>
  </Provider>,
  app
);

/**
 * Provide the stores to all child components to be grabbed up using the inject decorator
 * Init the Router
 * Load the Layout which has the basic page elements and routes, which themselves load page components
 */
// ReactDOM.render(
//   <Provider {...stores}>
//     <HashRouter>
//       <Layout stores={stores} />
//     </HashRouter>
//   </Provider>,
//   app
// );