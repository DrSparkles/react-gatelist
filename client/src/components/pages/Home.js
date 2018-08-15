/**
 * Home page
 */

import React from "react";
//import moment from "moment";
import { inject, observer } from 'mobx-react';

@inject('commonStore', 'groupStore', 'routerStore', 'userStore')
@observer
export default class Home extends React.Component {

  componentWillMount() {
    // if user has no groups, go to the page to add groups...
    if (this.props.groupStore.getNumUserGroups === 0){
      this.props.routerStore.push('/groups');
    }
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


