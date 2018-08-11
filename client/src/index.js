import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { HashRouter } from 'react-router-dom';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from "./components/pages/Layout";

import commonStore from './stores/commonStore';
import authStore from './stores/authStore';
import userStore from './stores/userStore';

const stores = {
  commonStore,
  authStore,
  userStore
};

const app = document.getElementById("root");

/**
 * Provide the stores to all child components to be grabbed up using the inject decorator
 * Init the Router
 * Load the Layout which has the basic page elements and routes, which themselves load page components
 */
ReactDOM.render(
  <Provider {...stores}>
    <HashRouter>
      <Layout stores={stores} />
    </HashRouter>
  </Provider>,
  app
);