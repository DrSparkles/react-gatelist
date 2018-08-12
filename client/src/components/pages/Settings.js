/**
 * Settings page
 */

import React from "react";
// import moment from "moment";
import { inject, observer } from 'mobx-react';

@inject('commonStore', 'userStore')
@observer
export default class Settings extends React.Component {

  componentDidMount() {

  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){
    return (
      <div id='Settings'>
        <h2>Settings</h2>
      </div>
    );
  }
}