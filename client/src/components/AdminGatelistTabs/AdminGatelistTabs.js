import {inject, observer} from "mobx-react";
import React from "react";
import {getGatelistWeeks, getNextSaturday} from "../../utils/date.utils";
import { AdminGatelistTab } from './AdminGatelistTab';
import { Tab } from 'semantic-ui-react'

@inject('settingStore', 'interfaceStore', 'gatelistStore')
@observer
export class AdminGatelistTabs extends React.Component {

  weeks = this.props.weeks;

  componentDidMount(){
    // const week = this.weeks[this.props.interfaceStore.adminTabIndex];
    // this.loadWeekData(week);
  }

  handleChange = (event, value) => {
    this.props.interfaceStore.adminTabIndex = value;
  };

  loadWeekData = (week) => {
    this.props.gatelistStore.loadGatelistForWeek(week);
  };

  render() {

    const panes = this.weeks.map((week, index) => {
      return { menuItem: week, render: () => <AdminGatelistTab key={index} weekIndex={index} week={this.weeks[index]} title={week} /> };
    });

    const AdminTabs = () => <Tab panes={panes} />;

    return(

      <AdminTabs />

    );
  }
}

/*
<Tab eventKey={1} title="Tab 1">
          Tab 1 content
        </Tab>
        <Tab eventKey={2} title="Tab 2">
          Tab 2 content
        </Tab>
        <Tab eventKey={3} title="Tab 3" disabled>
          Tab 3 content
        </Tab>
 */