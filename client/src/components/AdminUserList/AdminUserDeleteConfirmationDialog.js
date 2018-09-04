import {observer} from "mobx-react";
import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

@observer
export class AdminUserDeleteConfirmationDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state.value = props.value;
  }

  state = {};

  handleEntering = () => {
  };

  handleCancel = () => {
    this.props.onClose(false);
  };

  handleOk = () => {
    this.props.onClose(true);
  };

  render() {
    const { value, ...other } = this.props;

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={this.handleEntering}
        aria-labelledby="confirmation-dialog-title"
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">Delete this user and all their groups?</DialogTitle>
        <DialogContent>
          <div>Are you sure you want to delete {this.props.value}?</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}