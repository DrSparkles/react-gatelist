import React from "react";
import { inject, observer } from 'mobx-react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

@inject('groupStore', 'routerStore', 'userStore')
@observer
export class GroupListItem extends React.Component {

  groupId = this.props.groupRow.groupId;
  groupName = this.props.groupRow.groupName;
  numGLSlots = this.props.groupRow.numGLSlots;

  handleSelectGroup = (ev) => {
    ev.preventDefault();
    const groupId = ev.target.value;
    this.props.groupStore.loadCurrentGroup(groupId);
    this.props.routerStore.push('/gatelist/' + groupId);
  };

  renderEditButtons = () => {
    //if (this.props.userStore.isAdmin === false) {
    if (this.props.userStore.isSuperAdmin) {
      return (
        <div className="form-group gatelist-form-controls">
          <button className='btn btn-sm' onClick={this.handleEditClick}><EditIcon className='icon edit-icon' /></button>
          <button className='btn btn-sm' onClick={this.handleDeleteClick}><DeleteForeverIcon className='icon delete-icon' /></button>
        </div>
      );
    }
    else {
      return (
        <span>&nbsp;</span>
      );
    }
  };

  renderGatelistSlots = () => {
    if (this.props.userStore.isSuperAdmin === true && this.props.groupStore.editGroupEntry){

    }
  };

  renderSelectGroupButton = () => {
    if (this.props.userStore.isUser || this.props.userStore.isSuperAdmin){
      return (
        <button
          id='selectGroup'
          name='selectGroup'
          value={this.groupId}
          className='btn-text btn btn-sm'
          onClick={this.handleSelectGroup}>
          Select
        </button>
      );
    }
    else {
      return(
        <span>&nbsp;</span>
      );
    }
  };

  render(){
    return (
      <tr>
        <td>{this.groupName}</td>
        <td className='center-cell'>{this.numGLSlots}</td>
        <td className='center-cell'>
          {this.renderEditButtons()}
          {this.renderSelectGroupButton()}
        </td>
      </tr>
    );
  }
}