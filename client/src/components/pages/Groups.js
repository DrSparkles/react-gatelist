/**
 * Groups page
 */

import React from "react";
//import moment from "moment";
import { inject, observer } from 'mobx-react';

import Group from "../group";

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
        <h1>My Groups</h1>
        <Group />
      </div>
    );
  }
}