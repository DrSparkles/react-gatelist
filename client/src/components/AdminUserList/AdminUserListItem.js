import {inject, observer} from "mobx-react";
import React from "react";
import { AdminUserDeleteConfirmationDialog } from "./AdminUserDeleteConfirmationDialog";
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SaveIcon from '@material-ui/icons/Save';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

@inject('userStore')
@observer
export class AdminUserListItem extends React.Component {

  state = {
    open: false,
    value: this.props.user.firstName + " " + this.props.user.lastName
  };

  handleSelectChange = (ev) => {
    ev.preventDefault();
    this.props.userStore.userForEdit.userType = ev.target.value;
  };

  getvalue = (firstName, lastName) => {
    return firstName + " " + lastName;
  };

  getGroupNames = (groups) => {
    const groupNames = groups.map((group) => {
      return group.groupName;
    });

    return groupNames;
  };

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
    this.props.userStore.deleteUserId = this.props.user.userId;
    this.props.userStore.deleteUser();
  };

  handleEditClick = (ev) => {
    ev.preventDefault();
    this.props.userStore.loadSelectedUser(this.props.user.userId);
    this.props.userStore.editingUser = true;
  };

  handleCancelChangeBtn = (ev) => {
    ev.preventDefault();
    console.log('Calcel Edit!!');
    this.props.userStore.editingUser = false;
    this.props.userStore.clearEditingUser();
  };

  handleSaveChangeBtn = (ev) => {
    ev.preventDefault();

    console.log('user to save', this.props.userStore.userForEdit);

    this.props.userStore.adminEditUser();
    this.props.userStore.editingUser = false;

    console.log('Save Edit!!');
  };

  renderUserTypeDropdown = () => {

    if (this.props.userStore.editingUser && this.props.user.userId === this.props.userStore.userForEdit.userId){

      const { userType } = this.props.userStore.userForEdit;
      console.log('userType', userType);
      return(
        <select name='user-type' value={userType} onChange={this.handleSelectChange}>
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
          <option value='superadmin'>Super Admin</option>
        </select>
      );
    }
    else {
      return this.props.userStore.getUserTypeLabel(this.props.user.userType);
    }
  };

  renderEditButtons = () => {
    if (this.props.userStore.editingUser === false){
      return (
        <div className="form-group gatelist-form-controls">
          <button className='btn btn-sm' onClick={this.handleEditClick}><EditIcon className='icon edit-icon' /></button>
          <button className='btn btn-sm' onClick={this.handleDeleteClick}><DeleteForeverIcon className='icon delete-icon' /></button>
        </div>
      );
    }
    else {
      return null;
    }
  };

  renderEditingGroupButtons = () => {
    if (this.props.userStore.editingUser &&
        this.props.user.userId === this.props.userStore.userForEdit.userId){
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

  render() {
    const { firstName, lastName, email, groups } = this.props.user;

    const fullName = this.getvalue(firstName, lastName);
    const groupNames = this.getGroupNames(groups).join(', ');
    return(
      <tr>
        <td>{fullName}</td>
        <td><a href="mailto:{email}">{email}</a></td>
        <td>{this.renderUserTypeDropdown()}</td>
        <td>{groupNames}</td>
        <td>
          <div className="form-group gatelist-form-controls">
            {this.renderEditButtons()}
            {this.renderEditingGroupButtons()}
          </div>
          <AdminUserDeleteConfirmationDialog
            open={this.state.open}
            onClose={this.handleClose}
            value={this.state.value}
          />
        </td>
      </tr>
    );
  }

}