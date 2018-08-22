import {inject, observer} from "mobx-react";
import React from "react";
import {getGatelistWeeks} from "../../utils/date.utils";
import Paper from '@material-ui/core/Paper';

@inject('groupStore', 'routerStore', 'userStore', 'settingStore')
@observer
export class AdminGatelistTab extends React.Component {

  weeks = getGatelistWeeks(this.props.settingStore.settingValues.startWeekend, this.props.settingStore.settingValues.numWeeks);

  render() {

    const { tabValue, index } = this.props;

    if (tabValue === index){
      return (
        <div>
          <button>Download CSV</button>
          <br />
          Item One index {index} tab value{tabValue}

        </div>
      );
    }
    return (
      null
    );
  }
}