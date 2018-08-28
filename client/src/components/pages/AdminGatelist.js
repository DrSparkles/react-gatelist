import React from "react";
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {AdminGatelistTabs} from "../AdminGatelistTabs";
import {getGatelistWeeks, getNextSaturday} from "../../utils/date.utils";

@inject('gatelistStore', 'interfaceStore', 'settingStore')
@observer
export default class AdminGatelist extends React.Component {

  weeks = getGatelistWeeks(this.props.settingStore.settingValues.startWeekend, this.props.settingStore.settingValues.numWeeks);

  componentDidMount() {
    const nextSaturday = getNextSaturday();
    const weekIndex = this.weeks.indexOf(nextSaturday);
    if (weekIndex >= 0) {
      this.props.interfaceStore.adminTabIndex = weekIndex;
    }
    else {
      this.props.interfaceStore.adminTabIndex = 0;
    }
  }

  render(){

    if (this.props.gatelistStore.loadingGatelist){
      return (
        <CircularProgress />
      );
    }
    else {
      const currentWeek = this.weeks[this.props.interfaceStore.adminTabIndex];
      return (
        <div id='AdminGatelist'>
          <AdminGatelistTabs weeks={this.weeks} currentWeek={currentWeek} />
        </div>
      );
    }
  }
}
