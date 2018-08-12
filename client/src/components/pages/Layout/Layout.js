
import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { inject, observer } from 'mobx-react';

import mainStyles from '../../../styles/masterStyle.css';

import Header from '../../Header';
import Home from '../Home';
import Login from '../Login';
import Register from '../Register';
import PrivateRoute from "../../PrivateRoute";
import Groups from "../Groups";

@inject('commonStore', 'userStore')
@withRouter
@observer
export default class Layout extends React.Component {

  componentWillMount() {
    if (!this.props.commonStore.token) {
      this.props.commonStore.setAppLoaded();
    }
  }

  componentDidMount() {
    if (this.props.commonStore.token) {
      this.props.userStore
        .pullUser()
        .finally(() => this.props.commonStore.setAppLoaded());
    }
  }

  render(){
    if (this.props.commonStore.appLoaded) {
      return (
        <div id='layout'>
          <Header />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/add-group" component={Groups} />
            <Route path="/list/:listId/tasks/:taskId?" component={Home} />
            <Route path="/list/:listId?" component={Home} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      );
    }
    else {
      return (
        <div id='Layout' className="container">
          <Header />
        </div>
      );
    }
  }
}