import {inject, observer} from "mobx-react";
import React from "react";
import { DownloadCSVBtn } from '../DownloadCSV';
import { GatelistList } from "../GatelistList";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Tab } from 'semantic-ui-react'

@inject('gatelistStore', 'interfaceStore')
@observer
export class AdminGatelistTab extends React.Component {

  week = this.props.week;
  gatelistData = {};

  componentDidMount(){
    this.gatelistData = this.loadWeekData(this.week);
    console.log('AdminGatelistTab componentDidMount this.gatelistData', this.gatelistData);
  }

  loadWeekData = (week) => {
    this.props.gatelistStore.loadGatelistForWeek(week);
  };

  render() {
    const { weekIndex } = this.props;
    const tabValue = this.props.interfaceStore.adminTabIndex;

    // const gatelistByWeek = this.props.gatelistStore.gatelistByWeek;
    // gatelistByWeek[this.week]
    // console.log('gatelistByWeek', gatelistByWeek);

    if (this.props.gatelistStore.loadingGatelist){
      console.log('in loading spinner');
      return (
        <LoadingSpinner />
      );
    }
    else {
      console.log('in tab pane');
      console.log('this.week', this.week);
      const gatelistData = this.props.gatelistStore.gatelistByWeek;
      const currentWeekData = gatelistData[this.week];
      console.log('AdminGatelistTab gatelistData', gatelistData);
      console.log('admingatelisttab currentweekdata', currentWeekData);
      // const currentWeekDataArray = Object.values(currentWeekData);
      let currentWeekDataArray = [];
      if (currentWeekData !== undefined){
        currentWeekDataArray = Object.values(currentWeekData);
      }
      return (
        <Tab.Pane>
          <div>

            Item One index {weekIndex} tab value {tabValue}
            <br />
            <br />
            <DownloadCSVBtn downloadData={this.gatelist} />
            <br />
            <GatelistList week={this.week} gatelistData={currentWeekDataArray} className='flex-row' />
          </div>
        </Tab.Pane>
      );
    }
  }
}