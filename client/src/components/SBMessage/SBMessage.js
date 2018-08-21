import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
// import { inject, observer } from 'mobx-react';

import './style.css';

export default class SBMessage extends React.Component {

  componentWillMount(){
    this.state.open = true;
  }

  state = {
    open: false,
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render(){

    const { msg } = this.props;

    return (
      <Snackbar
        open={this.state.open}
        autoHideDuration={4000}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={msg}
        onClose={this.handleClose}
      />
    );
  }
}