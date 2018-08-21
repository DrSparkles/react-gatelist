import React from 'react';
import { inject, observer } from 'mobx-react';
import moment from "moment";

import './style.css';

import MainNav from '../MainNav';

/**
 * Site header
 */
@inject('userStore', 'commonStore')
@observer
class Footer extends React.Component {

  getYear(){
    return moment().format('YYYY');
  }

  render() {
    return (
      <div id='Footer'>
        <nav>
          <MainNav navPlacement='footer' />
          &copy; gwendolyn {this.getYear()}
        </nav>
      </div>
    );
  }
}

export default Footer;
