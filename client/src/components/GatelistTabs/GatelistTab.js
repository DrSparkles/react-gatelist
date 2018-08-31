import {inject, observer} from "mobx-react";
import React from "react";
import { GatelistList } from "../GatelistList";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Tab } from 'semantic-ui-react'

import './style.css';
import {GatelistForm} from "../GatelistForm";

@inject('gatelistStore', 'interfaceStore', 'userStore')
@observer
export class GatelistTab extends React.Component {

  week = this.props.week;

  componentDidMount(){

  }

  render() {

    const { week } = this.props;
    const gatelistData = this.props.gatelistStore.getGatelistEntriesForWeek(week);

    if (this.props.gatelistStore.loadingGatelist){
      return (
        <LoadingSpinner />
      );
    }
    else {
      return (
        <Tab.Pane>
          <div className='gatelist-week'>
            <GatelistForm week={this.week} className='flex-row' />
            <GatelistList week={this.week} gatelistData={gatelistData} adminView={this.props.userStore.isAdmin} className='flex-row' />
          </div>
        </Tab.Pane>
      );
    }
  }
}