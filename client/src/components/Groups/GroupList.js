import React from "react";
import { inject, observer } from 'mobx-react';
import { GroupListItem } from "../Groups";

@inject('groupStore', 'routerStore', 'userStore')
@observer
export class GroupList extends React.Component {

  render(){

    const groups = this.props.groupStore.getUserGroups;
    console.log('groups', groups);
    console.log('groups length', groups.length);

    const groupRows = groups.map((group) => {
      return <GroupListItem key={group.groupId} groupRow={group} />;
    });

    return (
      <table id='group-list' className='table'>
        <thead>
          <tr>
            <td width='60%'>Group Name</td>
            <td width='20%' className='center-cell'>Number of Slots</td>
            <td width='20%' className='center-cell'>Select</td>
          </tr>
        </thead>
        <tbody>
        {groupRows}
        </tbody>
      </table>
    );
  }
}