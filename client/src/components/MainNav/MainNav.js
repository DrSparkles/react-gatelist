import React from "react";
import { Link, withRouter } from "react-router-dom";
import { inject, observer } from 'mobx-react';

import './style.css';

/**
 * Primary site navigation; dependant on logged in status
 */
@inject('userStore', 'commonStore', 'authStore')
@withRouter
@observer
export default class MainNav extends React.Component {

  navClass = (this.props.navPlacement === 'header') ? 'main-nav' : 'footer-nav';

  handleClickLogout = () =>
    this.props.authStore
      .logout()
      .then(() => this.props.history.replace('/'));

  render(){
    return (
      <div>
        <LoggedOutView navClass={this.navClass} currentUser={this.props.userStore.currentUser} />
        <LoggedInView navClass={this.navClass} isSuperAdmin={this.props.userStore.isSuperAdmin} isAdmin={this.props.userStore.isAdmin} currentUser={this.props.userStore.currentUser} onLogout={this.handleClickLogout} />
      </div>
    );
  }
}

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className={props.navClass}>
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
      <div className='nav-list-container'>
        <SuperAdminOptions navClass={props.navClass} isSuperAdmin={props.isSuperAdmin} isAdmin={props.isAdmin} />
        <AdminOptions navClass={props.navClass} isSuperAdmin={props.isSuperAdmin} isAdmin={props.isAdmin} />
        <ul className={props.navClass}>
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
      <div className='nav-list-container'>
        <ul className={props.navClass}>
          <li><Link to='/admin/gatelist'>Gatelist</Link></li>
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
      <div className='nav-list-container'>
        <ul className={props.navClass}>
          <li><Link to='/settings'>Settings</Link></li>
          <li><Link to='/users'>Users</Link></li>
        </ul>
        <br clear='all' />
      </div>
    );
  }
  return null;
};