import React from "react";
import { inject, observer } from 'mobx-react';
import { GroupListItem } from "../Groups";
import { computed } from 'mobx';

@inject('groupStore', 'routerStore', 'userStore')
@observer
export class GroupList extends React.Component {

  render(){

    const { groups } = this.props;

    console.log('GroupList groups', groups);
    console.log('GroupList groups length', groups.length);

    const groupRows = groups.map((group, index) => {
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