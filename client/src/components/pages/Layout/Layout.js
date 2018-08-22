import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom'
import React from 'react';
import { inject, observer } from 'mobx-react';

/* eslint-disable */
import mainStyles from '../../../styles/masterStyle.css';

import Header from '../../Header';
import Home from '../Home';
import Login from '../Login';
import Register from '../Register';
import PrivateRoute from "../../PrivateRoute";
import Groups from "../Groups";
import Profile from "../Profile";
import Settings from "../Settings";
import Users from "../Users";
import Gatelist from "../Gatelist";
import ManageGroups from "../ManageGroups";
import Footer from "../../Footer/Footer";

@inject('commonStore', 'userStore', 'settingStore')
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

    // const { location, push, goBack } = this.props.routing;
    // console.log(this.props.routing);

    if (this.props.commonStore.appLoaded) {
      return (
        <div id='layout'>
          <Header />
          <div id='content'>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <PrivateRoute path="/add-group" component={Groups} />
              <PrivateRoute path="/groups/:groupId?" component={Groups} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/manage-groups/:groupId?" component={ManageGroups} />
              <PrivateRoute path="/settings" component={Settings} />
              <PrivateRoute path="/users" component={Users} />
              <PrivateRoute path="/gatelist/:groupId?" component={Gatelist} />
              <Route path="/home" component={Home} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
          <Footer />
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