import React from "react";
import { inject, observer } from 'mobx-react';
import { GroupListItem } from "../Groups";

@inject('groupStore', 'routerStore', 'userStore')
@observer
export class GroupList extends React.Component {

  groups = this.props.groups;

  render(){
    console.log('GroupList groups', this.groups);
    console.log('GroupList groups length', this.groups.length);

    const groupRows = this.groups.map((group, index) => {
      return <GroupListItem key={group.groupId} index={index} groupRow={group} />;
    });

    return (
      <table id='group-list' className='table'>
        <thead>
          <tr>
            <td width='40%'>Group Name</td>
            <td width='30%' className='center-cell'>Number of Slots</td>
            <td width='30%' className='center-cell'>Select</td>
          </tr>
        </thead>
        <tbody>
        {groupRows}
        </tbody>
      </table>
    );
  }
}