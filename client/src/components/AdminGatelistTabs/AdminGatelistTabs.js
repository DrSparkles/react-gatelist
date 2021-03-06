import {inject, observer} from "mobx-react";
import React from "react";
import { AdminGatelistTab } from './AdminGatelistTab';
import { Tab } from 'semantic-ui-react'
import {getCurrentUpcomingWeek, getIndexOfWeek} from "../../utils/date.utils";

@inject('settingStore', 'interfaceStore', 'gatelistStore')
@observer
export class AdminGatelistTabs extends React.Component {

  weeks = this.props.weeks;

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
  };

  render() {

    const panes = this.weeks.map((week, index) => {
      return { menuItem: week, render: () => <AdminGatelistTab key={index} weekIndex={index} week={this.weeks[index]} title={week} /> };
    });

    const AdminTabs = () => {
      return (
        <Tab
          panes={panes}
          onTabChange={this.handleOnTabChange}
          defaultActiveIndex={this.activeTab}
        />
      );
    };

    return(

      <AdminTabs />

    );
  }
}