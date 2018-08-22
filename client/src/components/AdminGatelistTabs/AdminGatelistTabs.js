import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {inject, observer} from "mobx-react";
import React from "react";
import {getGatelistWeeks} from "../../utils/date.utils";
import { AdminGatelistTab } from './AdminGatelistTab';

@inject('groupStore', 'routerStore', 'userStore', 'settingStore')
@observer
export class AdminGatelistTabs extends React.Component {

  weeks = getGatelistWeeks(this.props.settingStore.settingValues.startWeekend, this.props.settingStore.settingValues.numWeeks);

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {

    const { value } = this.state;

    const weekTabLabels = this.weeks.map((week, index) => {
      return <Tab label={week} />;
    });

    const weekItems = this.weeks.map((week, index) => {
      return <AdminGatelistTab key={index} week={week} index={index} tabValue={value} />;
    });

    return (
      <div>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            {weekTabLabels}
          </Tabs>
        </AppBar>
        {weekItems}
      </div>
    );
  };
}

/*
<Tab label="Item One" />
<Tab label="Item Two" />
<Tab label="Item Three" href="#basic-tabs" />
 */