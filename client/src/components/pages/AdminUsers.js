/**
 * Groups page
 */
import React from "react";
import { inject, observer } from 'mobx-react';

@inject('groupStore')
@observer
export default class AdminUsers extends React.Component {

  componentDidMount() {

  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){

    const numGroups = this.props.groupStore.getNumUserGroups;
    return (
      <div id='Users'>
        <h2>Users</h2>

      </div>
    );
  }
}