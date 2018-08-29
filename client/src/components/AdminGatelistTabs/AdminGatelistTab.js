import {inject, observer} from "mobx-react";
import React from "react";
import { DownloadCSVBtn } from '../DownloadCSV';
import { GatelistList } from "../GatelistList";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Tab } from 'semantic-ui-react'

import './style.css';

@inject('gatelistStore', 'interfaceStore', 'userStore')
@observer
export class AdminGatelistTab extends React.Component {

  week = this.props.week;
  gatelistData = {};

  fileName = this.week + '-gatelist';
  headerData = {groupName: 'Group Name', firstName: 'First Name', lastName: 'Last Name', minor: 'Minor', notes: 'Notes'};

  componentDidMount(){
    this.gatelistData = this.loadWeekData(this.week);
    console.log('AdminGatelistTab componentDidMount this.gatelistData', this.gatelistData);
  }

  loadWeekData = (week) => {
    this.props.gatelistStore.loadGatelistForWeek(week);
  };

  gatelistCSVDataFilter = (gatelistEntry) => {
    const filtered = {
      groupName: gatelistEntry.groupName,
      firstName: gatelistEntry.firstName,
      lastName: gatelistEntry.lastName,
      minor: gatelistEntry.minor,
      notes: gatelistEntry.notes
    };
    return filtered;
  };

  render() {
    // const { weekIndex } = this.props;
    // const tabValue = this.props.interfaceStore.adminTabIndex;

    if (this.props.gatelistStore.loadingGatelist){
      console.log('in loading spinner');
      return (
        <LoadingSpinner />
      );
    }
    else {

      const gatelistData = this.props.gatelistStore.gatelistByWeek;
      const currentWeekData = gatelistData[this.week];

      let currentWeekDataArray = [];
      if (currentWeekData !== undefined){
        currentWeekDataArray = Object.values(currentWeekData);
      }

      return (
        <Tab.Pane>
          <div>
            <DownloadCSVBtn fileName={this.fileName} dataFilter={this.gatelistCSVDataFilter} headerData={this.headerData} downloadData={currentWeekDataArray} className='download-csv-btn' />
            <GatelistList week={this.week} gatelistData={currentWeekDataArray} adminView={this.props.userStore.isAdmin} className='flex-row' />
          </div>
        </Tab.Pane>
      );
    }
  }
}