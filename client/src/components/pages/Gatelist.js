/**
 * Gatelist page
 */
import React from "react";
import { inject, observer } from 'mobx-react';
import { GatelistTabs } from '../GatelistTabs';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

@inject('groupStore', 'routerStore', 'gatelistStore')
@observer
export default class Gatelist extends React.Component {

  componentDidMount() {
    if (this.props.groupStore.currentGroup.groupId === 0){
      this.props.routerStore.push('/groups');
      return null;
    }

    this.props.gatelistStore.loadGroupsGatelist();
  }

  /**
   * Render our document!
   * @returns {*}
   */
  render(){

    if (this.props.gatelistStore.loadingGatelist){
      return (
        <LoadingSpinner/>
      );
    }
    else {
      return (
        <div id='Gatelist'>
          <GatelistTabs />
        </div>
      );
    }
  }
}
