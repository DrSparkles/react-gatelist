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

import './styles/colors.css';

import Layout from "./components/pages/Layout";

import commonStore from './stores/commonStore';
import authStore from './stores/authStore';
import userStore from './stores/userStore';
import groupStore from './stores/groupStore';
import settingStore from './stores/settingStore';
import gatelistStore from './stores/gatelistStore';
import interfaceStore from './stores/interfaceStore';

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
  routerStore,
  interfaceStore
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