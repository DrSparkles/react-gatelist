import React from "react";
import { inject, observer } from 'mobx-react';

@inject('groupStore', 'routerStore', 'userStore')
@observer
export class GroupListItem extends React.Component {

  handleSelectGroup = (ev) => {
    ev.preventDefault();
    const groupId = ev.target.value;
    this.props.groupStore.loadCurrentGroup(groupId);
    this.props.routerStore.push('/gatelist/' + groupId);
  };

  render(){

    const { groupId, groupName, numGLSlots } = this.props.groupRow;

    return (
      <tr>
        <td>{groupName}</td>
        <td>{numGLSlots}</td>
        <td><button name='selectGroup' id='selectGroup' value={groupId} onClick={this.handleSelectGroup}>Select</button></td>
      </tr>
    );
  }
}