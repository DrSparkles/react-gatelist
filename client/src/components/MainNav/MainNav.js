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
        <LoggedOutView currentUser={this.props.userStore.currentUser} />

        <LoggedInView currentUser={this.props.userStore.currentUser} onLogout={this.handleClickLogout} />
      </div>
    );
  }
}

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className='nav'>

        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Sign up
          </Link>
        </li>

      </ul>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <ul className='nav'>

        <li className="nav-item">
          <a href='#' onClick={props.onLogout} className="nav-link">Log Out</a>
        </li>
      </ul>
    );
  }

  return null;
};