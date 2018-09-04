import React from "react";
import { inject, observer } from 'mobx-react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import {GroupDeleteConfirmationDialog} from "./GroupDeleteConfirmationDialog";

@inject('groupStore', 'routerStore', 'userStore')
@observer
export class GroupListItem extends React.Component {

  groupId = this.props.groupRow.groupId;
  groupName = this.props.groupRow.groupName;
  numGLSlots = this.props.groupRow.numGLSlots;
  index = this.props.index;

  state = {
    open: false,
    value: this.groupName
  };

  getFieldId(name, index){
    return name + "_" + index;
  }

  handleDeleteClick = (ev) => {
    ev.preventDefault();
    this.setState({ open: true });
  };

  handleClose = (value) => {
    this.setState({ value, open: false });
    console.log('handleClose value', value);
    if (value){
      this.deleteUserFromClick();
    }
  };

  deleteUserFromClick = () => {
    this.props.groupStore.deleteGroupId = this.groupId;
    this.props.groupStore.deleteGroup();
  };

  handleSelectGroup = (ev) => {
    ev.preventDefault();
    const groupId = ev.target.value;
    this.props.groupStore.loadCurrentGroup(groupId);
    this.props.routerStore.push('/gatelist/' + groupId);
  };

  handleEditClick = (ev) => {
    ev.preventDefault();
    this.props.groupStore.loadCurrentGroup(this.groupId);
    this.props.groupStore.editGroupEntry = true;
  };

  handleEditGLSlots = (ev) => {
    console.log('handleEditGLSlots', ev.target.value);
    this.props.groupStore.currentGroup.numGLSlots = ev.target.value;
  };

  handleCancelChangeBtn = (ev) => {
    ev.preventDefault();
    console.log('Calcel Edit!!');
    this.props.groupStore.editGroupEntry = false;
    this.props.groupStore.clearCurrentGroup();
  };

  handleSaveChangeBtn = (ev) => {
    ev.preventDefault();

    console.log('group to save', this.props.groupStore.currentGroup);

    this.props.groupStore.saveGroup();
    this.props.groupStore.editGroupEntry = false;

    console.log('Save Edit!!');
  };

  renderGatelistSlots = (index) => {
    if (this.props.userStore.isSuperAdmin === true &&
        this.props.groupStore.editGroupEntry &&
        this.props.groupStore.currentGroup.groupId === this.groupId){
      return (
        <div>
          <label className="sr-only" htmlFor={this.getFieldId('numGLSlots', index)}>Num Gatelist Slots</label>
          <input
            id={this.getFieldId('numGLSlots', index)}
            type="text"
            placeholder="Gatelist Slots"
            value={this.props.groupStore.currentGroup.numGLSlots}
            onChange={this.handleEditGLSlots}
            className="form-control form-control-sm"
          />
        </div>
      );
    }
    else {
      return(
        <div>
          {this.numGLSlots}
        </div>
      );
    }
  };

  renderSelectGroupButton = () => {
    if (((this.props.userStore.isUser || this.props.userStore.isSuperAdmin) &&
        (this.props.groupStore.editGroupEntry === true &&
         this.props.groupStore.currentGroup.groupId !== this.groupId)) ||
        this.props.groupStore.editGroupEntry === false){
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
      return null;
    }
  };

  renderEditButtons = () => {
    if (this.props.userStore.isSuperAdmin) {
      if (this.props.groupStore.editGroupEntry === true && this.props.groupStore.currentGroup.groupId !== this.groupId){
        console.log('PRINT EDIT AND DELETE BUTTONS', this.props.groupStore.currentGroup.groupId, this.groupId);
        return (
          <div className="form-group gatelist-form-controls">
            <button className='btn btn-sm' onClick={this.handleEditClick}><EditIcon className='icon edit-icon' /></button>
            <button className='btn btn-sm' onClick={this.handleDeleteClick}><DeleteForeverIcon className='icon delete-icon' /></button>
          </div>
        );
      }
      else if (this.props.groupStore.editGroupEntry === false){
        return (
          <div className="form-group gatelist-form-controls">
            <button className='btn btn-sm' onClick={this.handleEditClick}><EditIcon className='icon edit-icon' /></button>
            <button className='btn btn-sm' onClick={this.handleDeleteClick}><DeleteForeverIcon className='icon delete-icon' /></button>
          </div>
        );
      }
      else {
        console.log('HIDE EDIT AND DELETE BUTTONS', this.props.groupStore.currentGroup.groupId, this.groupId);
        return null;
      }
    }
    else {
      return (
        <span>&nbsp;</span>
      );
    }
  };

  renderEditingGroupButtons = () => {
    if (this.props.userStore.isSuperAdmin === true &&
        this.props.groupStore.editGroupEntry &&
        this.props.groupStore.currentGroup.groupId === this.groupId){
      return (
        <div className='gatelist-form-controls'>
          <button onClick={this.handleSaveChangeBtn} className='btn btn-sm'><SaveIcon className='icon save-icon'/></button>
          <button onClick={this.handleCancelChangeBtn} className='btn btn-sm'><NotInterestedIcon className='icon cancel-icon'/></button>
        </div>
      );
    }
    else {
      return null;
    }
  };

  render(){
    // console.log('this.props.groupRow', this.props.groupRow);
    return (
      <tr>
        <td>{this.groupName}</td>
        <td className='center-cell'>
          {this.renderGatelistSlots(this.index)}
         </td>
        <td className='center-cell'>
          {this.renderEditButtons()}
          {this.renderEditingGroupButtons()}
          {this.renderSelectGroupButton()}
          <GroupDeleteConfirmationDialog
            open={this.state.open}
            onClose={this.handleClose}
            value={this.state.value}
          />
        </td>
      </tr>
    );
  }
}