/**
 * Groups page
 */
import React from "react";
import { inject, observer } from 'mobx-react';
import { GroupForm, GroupList } from "../Groups";

@inject('groupStore')
@observer
export default class Groups extends React.Component {

  groups = [];

  setupMessageText(numGroups){
    const message = {hasMessage: false, text: ''};

    if (numGroups < 1){
      message.hasMessage = true;
      message.text = "Before you can add your gatelist, please add your group.";
    }
    else if (numGroups > 0 && !this.props.groupStore.currentGroup.groupId) {
      message.hasMessage = true;
      message.text = "Please select a group to add your gatelist.";
    }

    return message;
  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){
    this.groups = this.props.groupStore.getUserGroups;
    const numGroups = this.props.groupStore.getNumUserGroups;
    console.log('Groups this.setupMessageText(numGroups)', this.setupMessageText(numGroups));
    return (
      <div id='Group'>
        <h2>My Groups</h2>
        <CreateGroupMessage displayMessage={this.setupMessageText(numGroups)} />
        <GroupForm />
        <GroupList groups={this.groups} />
      </div>
    );
  }
}

const CreateGroupMessage = (props) => {
  if (props.displayMessage.hasMessage){
    return (
      <div className='groups-notification-message'>
        {props.displayMessage.text}
      </div>
    );
  }
  else {
    return null;
  }
};