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
        <td className='center-cell'>{numGLSlots}</td>
        <td className='center-cell'>
          <button
            id='selectGroup'
            name='selectGroup'
            value={groupId}
            className='btn-text btn btn-sm'
            onClick={this.handleSelectGroup}>
              Select
          </button>
        </td>
      </tr>
    );
  }
}