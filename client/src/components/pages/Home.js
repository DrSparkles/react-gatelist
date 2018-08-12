/**
 * Home page
 */

import React from "react";
//import moment from "moment";
import { inject, observer } from 'mobx-react';

@inject('commonStore', 'userStore')
@observer
export default class Home extends React.Component {

  componentDidMount() {

  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){

    if (this.props.userStore.currentUser){
      return (
        <div id='Home'>
          <h2>Home</h2>
        </div>
      );
    }
    else {
      return (<div id='Home'></div>);
    }
  }
}