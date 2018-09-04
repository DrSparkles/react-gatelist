/**
 * Groups page
 */
import React from "react";
import { inject, observer } from 'mobx-react';
import { GroupForm, GroupList } from "../Groups";
import { computed } from 'mobx';

@inject('groupStore')
@observer
export default class Groups extends React.Component {

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

  @computed get numGroups(){
    return this.props.groupStore.getNumUserGroups;
  }

  @computed get userGroups(){
    return this.props.groupStore.getUserGroups;
  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){
    console.log('Groups in render of Groups', this.props.groupStore.getUserGroups);
    console.log('Groups this.setupMessageText(numGroups)', this.setupMessageText(this.numGroups));
    return (
      <div id='Group'>
        <h2>My Groups</h2>
        <CreateGroupMessage displayMessage={this.setupMessageText(this.numGroups)} />
        <GroupForm />
        <GroupList groups={this.userGroups} />
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