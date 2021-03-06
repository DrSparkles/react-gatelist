import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom'
import React from 'react';
import { inject, observer } from 'mobx-react';

import '../../../styles/masterStyle.css';

/*
import Settings from "../Settings";
import Users from "../Users";
import ManageGroups from "../ManageGroups";
*/

import Header from '../../Header';
import Home from '../Home';
import Login from '../Login';
import Register from '../Register';
import PrivateRoute from "../../PrivateRoute";
import Groups from "../Groups";
import Profile from "../Profile";
import Gatelist from "../Gatelist";
import Footer from "../../Footer/Footer";
import AdminGatelist from "../AdminGatelist";
import AdminUsers from '../AdminUsers';
import AdminManageGroups from "../AdminManageGroups";
import AdminSettings from "../AdminSettings";
import DevTools from "mobx-react-devtools";

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
          {/*<DevTools/>*/}
          <Header />
          <div id='content'>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <PrivateRoute path="/groups/:groupId?" component={Groups} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/gatelist/:groupId?" component={Gatelist} />
              <PrivateRoute path="/admin/gatelist/:groupId?" component={AdminGatelist} />
              <PrivateRoute path="/admin/users" component={AdminUsers} />
              <PrivateRoute path="/admin/manage-groups" component={AdminManageGroups} />
              <PrivateRoute path="/admin/settings" component={AdminSettings} />
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