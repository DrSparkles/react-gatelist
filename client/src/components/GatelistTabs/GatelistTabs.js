import {inject, observer} from "mobx-react";
import React from "react";
import { GatelistTab } from './GatelistTab';
import { Tab } from 'semantic-ui-react'
import { getGatelistWeeks, getCurrentUpcomingWeek, getIndexOfWeek } from "../../utils/date.utils";

@inject('settingStore', 'interfaceStore', 'gatelistStore')
@observer
export class GatelistTabs extends React.Component {

  weeks = getGatelistWeeks(this.props.settingStore.settingValues.startWeekend, this.props.settingStore.settingValues.numWeeks);

  upcomingWeek = getCurrentUpcomingWeek();

  activeTab = getIndexOfWeek(this.weeks, this.upcomingWeek);

  /**
   * Set the current week
   */
  componentDidMount(){
    this.props.interfaceStore.workingWithWeek = this.upcomingWeek;
  }

  /**
   * Set the week we're looking at and clear the toggles for showing the form
   * @param ev
   * @param data
   */
  handleOnTabChange = (ev, data) => {
    this.props.interfaceStore.workingWithWeek = this.weeks[data.activeIndex];
    this.props.gatelistStore.addGLEntry = false;
    this.props.gatelistStore.editGLEntry = false;
  };

  render() {

    const panes = this.weeks.map((week, index) => {
      return { menuItem: week, render: () => <GatelistTab key={index} weekIndex={index} week={this.weeks[index]} title={week} /> };
    });

    const GatelistTabs = () => {
      return (
        <Tab
          panes={panes}
          onTabChange={this.handleOnTabChange}
          defaultActiveIndex={this.activeTab}
        />
      );
    };

    return(
      <GatelistTabs />
    );
  }
}