/**
 * Manage Groups page
 */

import React from "react";
//import moment from "moment";
import { inject, observer } from 'mobx-react';

@inject('commonStore', 'userStore')
@observer
export default class ManageGroups extends React.Component {

  componentDidMount() {

  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){
    return (
      <div id='ManageGroups'>
        <h2>Manage Groups</h2>
      </div>
    );
  }
}