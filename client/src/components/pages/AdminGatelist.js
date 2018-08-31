import React from "react";
import { inject, observer } from 'mobx-react';
import {AdminGatelistTabs} from "../AdminGatelistTabs";
import {getGatelistWeeks, getCurrentUpcomingWeek} from "../../utils/date.utils";

@inject('gatelistStore', 'interfaceStore', 'settingStore')
@observer
export default class AdminGatelist extends React.Component {

  weeks = getGatelistWeeks(this.props.settingStore.settingValues.startWeekend, this.props.settingStore.settingValues.numWeeks);

  componentDidMount() {
    const nextSaturday = getCurrentUpcomingWeek();
    const weekIndex = this.weeks.indexOf(nextSaturday);
    if (weekIndex >= 0) {
      this.props.interfaceStore.adminTabIndex = weekIndex;
    }
    else {
      this.props.interfaceStore.adminTabIndex = 0;
    }

    this.loadWeekData(this.weeks[this.props.interfaceStore.adminTabIndex]);
    console.log('this.props.gatelistStore.gatelistByWeek',this.props.gatelistStore.gatelistByWeek);
  }

  loadWeekData = (week) => {
    this.props.gatelistStore.loadGatelistForWeek(week);
  };

  render(){
    return (
      <div>
        <AdminGatelistTabs weeks={this.weeks} />
      </div>
    );
  }
}
