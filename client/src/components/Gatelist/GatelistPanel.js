import React from 'react';
import { getGatelistWeeks } from '../../utils/date.utils';
import {inject, observer} from "mobx-react";
import {GatelistWeekPanel} from '../Gatelist';

@inject('groupStore', 'routerStore', 'userStore', 'settingStore')
@observer
export class GatelistPanels extends React.Component {

  weeks = getGatelistWeeks(this.settingStore.settingValues.startWeekend, this.settingStore.settingValues.numWeeks);

  render() {
    const { classes } = this.props;

    const weekItems = this.weeks.map((week) => {
      return <GatelistWeekPanel week={week} classes='' />;
    });

    return (
      <div className={classes.root}>
        {weekItems}
      </div>
    );
  };
}