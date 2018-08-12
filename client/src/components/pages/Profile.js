/**
 * Profiles page
 */

import React from "react";
// import moment from "moment";
import { inject, observer } from 'mobx-react';

@inject('commonStore', 'userStore')
@observer
export default class Profile extends React.Component {

  componentDidMount() {

  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){
    return (
      <div id='Profile'>
        <h2>Profile</h2>
      </div>
    );
  }
}