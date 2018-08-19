/**
 * Gatelist page
 */
import React from "react";
// import moment from "moment";
import { inject, observer } from 'mobx-react';
import { GatelistPanels } from '../GatelistExpansionPanel';
import CircularProgress from '@material-ui/core/CircularProgress';

@inject('commonStore', 'userStore', 'groupStore', 'routerStore', 'gatelistStore')
@observer
export default class Gatelist extends React.Component {

  componentDidMount() {
    if (this.props.groupStore.currentGroup.groupId === 0){
      this.props.routerStore.push('/groups');
      return null;
    }

    this.props.gatelistStore.loadGroupsGatelist(this.props.groupStore.currentGroup.groupId);
  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){

    if (this.props.gatelistStore.loadingGatelist){
      return (
        <CircularProgress/>
      );
    }
    else {
      return (
        <div id='Gatelist'>
          <h2>Gatelist</h2>
          <GatelistPanels />
        </div>
      );
    }
  }
}
