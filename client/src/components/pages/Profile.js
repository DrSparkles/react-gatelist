/**
 * Profiles page
 */

import React from "react";
// import moment from "moment";
import { inject, observer } from 'mobx-react';
import UserDetailsForm from "../UserDetailsForm/UserDetailsForm";

@inject('commonStore', 'userStore', 'authStore')
@observer
export default class Profile extends React.Component {

  componentDidMount() {

  }

  handleSaveUser = (ev) => {
    ev.preventDefault();
    this.props.userStore
      .saveUser();

  };

  /**
   * Render our document!
   * @returns {*}
   */
  render(){

    const user = this.props.userStore.currentUser;
    console.log('user', this.props.userStore.currentUser);

    return (
      <div id='Profile'>
        <h2>Profile</h2>
        <div className='profile-container'>
          <UserDetailsForm editableUser={user} handleSaveUser={this.handleSaveUser} />
        </div>
      </div>
    );
  }
}