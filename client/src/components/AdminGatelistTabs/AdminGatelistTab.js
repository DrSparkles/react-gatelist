import {inject, observer} from "mobx-react";
import React from "react";
import { DownloadCSVBtn } from '../DownloadCSV';
import { GatelistList } from "../GatelistList";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

@inject('gatelistStore', 'interfaceStore')
@observer
export class AdminGatelistTab extends React.Component {

  week = this.props.week;

  //this.loadWeekData(this.weeks[this.props.interfaceStore.adminTabIndex]);

  loadWeekData = (week) => {
    this.props.gatelistStore.loadGatelistForWeek(week);
  };

  render() {
    const { weekIndex } = this.props;
    const tabValue = this.props.interfaceStore.adminTabIndex;

    if (tabValue === weekIndex){
      if (this.props.gatelistStore.loadingGatelist){
        return (
          <LoadingSpinner />
        );
      }
      else {

        const gatelistByWeek = this.props.gatelistStore.gatelistByWeek;

        //gatelistByWeek[this.week]
        console.log('gatelistByWeek', gatelistByWeek);

        return (
          <div>

            <DownloadCSVBtn downloadData={this.gatelist} />

            Item One index {weekIndex} tab value {tabValue}

            <br />

            <GatelistList week={this.week} gatelistData={[]} className='flex-row' />

          </div>
        );
      }
    }
    return (
      null
    );
  }
}