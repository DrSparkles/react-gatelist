/**
 * Groups page
 */
import React from "react";
import { inject, observer } from 'mobx-react';

import { GroupForm, GroupList } from "../Groups";

@inject('groupStore')
@observer
export default class Groups extends React.Component {

  componentDidMount() {

  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){

    const numGroups = this.props.groupStore.getNumUserGroups;

    return (
      <div id='Group'>
        <h1>My Groups</h1>
        <CreateGroupMessage displayMessage={numGroups < 1} />
        <GroupForm />
        <GroupList />
      </div>
    );
  }
}

const CreateGroupMessage = (props) => {
  if (props.displayMessage){
    return (
      <div className='groups-notification-message'>
        Before you can add your gatelist, please add your group.
      </div>
    );
  }
  else {
    return null;
  }
};