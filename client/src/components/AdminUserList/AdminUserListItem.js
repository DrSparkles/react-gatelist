import {inject, observer} from "mobx-react";
import React from "react";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { AdminUserDeleteConfirmationDialog } from "./AdminUserDeleteConfirmationDialog";

@inject('userStore')
@observer
export class AdminUserListItem extends React.Component {

  userId = this.props.user.userId;
  firstName = this.props.user.firstName;
  lastName = this.props.user.lastName;
  email = this.props.user.email;
  userType = this.props.user.userType;
  groups = this.props.user.groups;

  state = {
    open: false,
    value: this.firstName + " " + this.lastName,
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
    this.props.userStore.deleteUserId = this.userId;
    this.props.userStore.deleteUser();
  };

  render() {
    const fullName = this.getvalue(this.firstName, this.lastName);
    const groupNames = this.getGroupNames(this.groups).join(', ');
    return(
      <tr>
        <td>{fullName}</td>
        <td><a href="mailto:{email}">{this.email}</a></td>
        <td>{this.userType}</td>
        <td>{groupNames}</td>
        <td>
          <div className="form-group gatelist-form-controls">
            <button className='btn btn-sm' onClick={this.handleDeleteClick}><DeleteForeverIcon className='icon delete-icon' /></button>
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