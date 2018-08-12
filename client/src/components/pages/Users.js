/**
 * Users page
 */

import React from "react";
// import moment from "moment";
import { inject, observer } from 'mobx-react';

@inject('commonStore', 'userStore')
@observer
export default class Users extends React.Component {

  componentDidMount() {

  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){
    return (
      <div id='Users'>
        <h2>Users</h2>
      </div>
    );
  }
}