import {inject, observer} from "mobx-react";
import React from "react";
import { AdminGatelistTab } from './AdminGatelistTab';
import { Tab } from 'semantic-ui-react'

@inject('settingStore', 'interfaceStore', 'gatelistStore')
@observer
export class AdminGatelistTabs extends React.Component {

  weeks = this.props.weeks;

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