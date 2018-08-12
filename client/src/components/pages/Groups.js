/**
 * Home page
 */

import React from "react";
import moment from "moment";
import { inject, observer } from 'mobx-react';

@inject('commonStore', 'userStore')
@observer
export default class Groups extends React.Component {

  componentDidMount() {

  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){
    return (
      <div id='Group'>
        <h2>Add Group</h2>
      </div>
    );
  }
}