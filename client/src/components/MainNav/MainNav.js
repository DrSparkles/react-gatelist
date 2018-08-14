import React from "react";
import { Link, withRouter } from "react-router-dom";
import { inject, observer } from 'mobx-react';


/**
 * Primary site navigation; dependant on logged in status
 */
@inject('userStore', 'commonStore', 'authStore')
@withRouter
@observer
export default class MainNav extends React.Component {

  handleClickLogout = () =>
    this.props.authStore
      .logout()
      .then(() => this.props.history.replace('/'));

  render(){
    return (
      <div>
        <div>Is logged in: {this.props.authStore.isLoggedIn} / {this.props.authStore.isLoggedIn ? 'was true' : 'was false'}</div>
        <LoggedOutView currentUser={this.props.userStore.currentUser} />
        <LoggedInView isSuperAdmin={this.props.userStore.isSuperAdmin} isAdmin={this.props.userStore.isAdmin} currentUser={this.props.userStore.currentUser} onLogout={this.handleClickLogout} />
      </div>
    );
  }
}

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className='main-nav'>
        <li><Link to="/login">Sign in</Link></li>
        <li><Link to="/register">Sign up</Link></li>
      </ul>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <div>
        <SuperAdminOptions isSuperAdmin={props.isSuperAdmin} isAdmin={props.isAdmin} />
        <AdminOptions isSuperAdmin={props.isSuperAdmin} isAdmin={props.isAdmin} />
        <ul className='main-nav'>
          <li><Link to='/groups'>My Groups</Link></li>
          <li><Link to='/profile'>My Profile</Link></li>
          <li><Link to='# ' onClick={props.onLogout}>Log Out</Link></li>
        </ul>
        <br clear='all' />
      </div>
    );
  }
  return null;
};

const AdminOptions = props => {
  if (props.isAdmin || props.isSuperAdmin){
    return (
      <div>
        <ul className='main-nav'>
          <li><Link to='/gatelist'>Gatelist</Link></li>
          <li><Link to='/manage-groups'>Manage Groups</Link></li>
        </ul>
        <br clear='all' />
      </div>
    );
  }
  return null;
};

const SuperAdminOptions = props => {
  if (props.isSuperAdmin){
    return (
      <div>
        <ul className='main-nav'>
          <li><Link to='/settings'>Settings</Link></li>
          <li><Link to='/users'>Users</Link></li>
        </ul>
        <br clear='all' />
      </div>
    );
  }
  return null;
};