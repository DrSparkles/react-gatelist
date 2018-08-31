import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

import './style.css';

export default class SBMessage extends React.Component {

  msg = this.props.msg;

  componentWillMount(){
    // this.state.open = true;
    this.setState({'open': true});
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

    return (
      <Snackbar
        open={this.state.open}
        autoHideDuration={4000}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={this.msg}
        onClose={this.handleClose}
      />
    );
  }
}