import React from 'react';
import { inject, observer } from 'mobx-react';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

import './style.css';

@inject()
@observer
class LoadingSpinner extends React.Component {

  render() {
    return (
      <div className='loading-spinner'>
        <CircularProgress/>
      </div>
    );
  }
}

export default LoadingSpinner;
