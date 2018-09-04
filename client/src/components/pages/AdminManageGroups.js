import React from "react";
import { inject, observer } from 'mobx-react';
import { GroupList } from "../Groups";
import {getGatelistWeeks} from "../../utils/date.utils";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

@inject('userStore', 'settingStore', 'groupStore')
@observer
export default class AdminManageGroups extends React.Component {

  weeks = getGatelistWeeks(this.props.settingStore.settingValues.startWeekend, this.props.settingStore.settingValues.numWeeks);

  groups = [];

  componentDidMount() {
    this.props.groupStore.loadAllGroups();
  }

  render(){
    if (this.props.groupStore.loadingGroups){
      return(
        <LoadingSpinner/>
      );
    }
    else {
      this.groups = this.props.groupStore.getAllGroups;
      return (
        <div>
          <GroupList groups={this.groups} isAdmin={this.props.userStore.isSuperAdmin} />
        </div>
      );
    }
  }
}
