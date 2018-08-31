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
        return <AdminUserListItem user={user} key={index} />
      });

      return(
        <div>
          <table className='table gatelist-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Groups</th>
                <th>&nbsp;</th>
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

