import {inject, observer} from "mobx-react";
import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import {AdminUserListItem} from "./AdminUserListItem";

@inject('userStore', 'messagingStore')
@observer
export class AdminUserList extends React.Component {

  componentDidMount(){
    this.props.userStore.loadAllUsers();
  }

  render() {

    if (this.props.userStore.loading){
      return (
        <LoadingSpinner />
      );
    }
    else {

      const userRows = this.props.userStore.users.map((user, index) => {
        console.log('user for user row', user);
        return <AdminUserListItem user={user} key={index} />
      });

      return(
        <div>
          <table className='table gatelist-table'>
            <thead>
              <tr>
                <th width='20%'>Name</th>
                <th width='20%'>Email</th>
                <th width='20%'>User Type</th>
                <th width='20%'>Groups</th>
                <th width='20%'>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {userRows}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

