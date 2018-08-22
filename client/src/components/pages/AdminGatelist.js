/**
 * Gatelist page
 */
import React from "react";
// import moment from "moment";
import { inject, observer } from 'mobx-react';
import { GatelistPanels } from '../GatelistExpansionPanel';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from "moment";
import {AdminGatelistTabs} from "../AdminGatelistTabs";

@inject('commonStore', 'userStore', 'groupStore', 'routerStore', 'gatelistStore')
@observer
export default class Gatelist extends React.Component {

  currentWeek = moment().startOf('week').format('YYYY-MM-DD');

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
        <div id='AdminGatelist'>
          <AdminGatelistTabs />
        </div>
      );
    }
  }
}
