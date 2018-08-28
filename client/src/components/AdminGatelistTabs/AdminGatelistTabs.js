import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {inject, observer} from "mobx-react";
import React from "react";
import {getGatelistWeeks, getNextSaturday} from "../../utils/date.utils";
import { AdminGatelistTab } from './AdminGatelistTab';

@inject('settingStore', 'interfaceStore', 'gatelistStore')
@observer
export class AdminGatelistTabs extends React.Component {

  weeks = this.props.weeks;

  componentDidMount(){

  }

  handleChange = (event, value) => {
    this.props.interfaceStore.adminTabIndex = value;
  };

  render() {

    const weekTabLabels = this.weeks.map((week, index) => {
      return <Tab label={week} key={index} />;
    });

    const weekItems = this.weeks.map((week, index) => {
      return <AdminGatelistTab key={index} week={week} weekIndex={index} />;
    });

    return (
      <div>
        <AppBar position="static">
          <Tabs value={this.props.interfaceStore.adminTabIndex} onChange={this.handleChange}>
            {weekTabLabels}
          </Tabs>
        </AppBar>
        {weekItems}
      </div>
    );
  };
}