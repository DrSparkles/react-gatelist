import React from "react";
import { inject, observer } from 'mobx-react';
import { GroupList } from "../Groups";
import {getGatelistWeeks} from "../../utils/date.utils";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

@inject('userStore', 'settingStore', 'groupStore')
@observer
export default class AdminManageGroups extends React.Component {

  weeks = getGatelistWeeks(this.props.settingStore.settingValues.startWeekend, this.props.settingStore.settingValues.numWeeks);

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
      console.log('Admin Manage Groups this.props.groupStore.getAllGroups', this.props.groupStore.getAllGroups);
      return (
        <div id='manage-groups'>
          <h2>Manage Groups</h2>
          <GroupList groups={this.props.groupStore.getAllGroups} isAdmin={this.props.userStore.isSuperAdmin} />
        </div>
      );
    }
  }
}
