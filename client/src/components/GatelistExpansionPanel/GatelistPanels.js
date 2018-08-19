import React from 'react';
import { getGatelistWeeks } from '../../utils/date.utils';
import {inject, observer} from "mobx-react";
import {GatelistWeekPanel} from './';

@inject('groupStore', 'routerStore', 'userStore', 'settingStore')
@observer
export class GatelistPanels extends React.Component {

  weeks = getGatelistWeeks(this.props.settingStore.settingValues.startWeekend, this.props.settingStore.settingValues.numWeeks);

  render() {

    const weekItems = this.weeks.map((week, index) => {
      return <GatelistWeekPanel key={index} week={week} index={index} />;
    });

    return (
      <div>
        {weekItems}
      </div>
    );
  };
}