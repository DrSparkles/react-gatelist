import React from "react";
import { inject, observer } from 'mobx-react';
import { AdminUserList } from "../AdminUserList";

@inject()
@observer
export default class AdminUsers extends React.Component {

  render(){

    return (
      <div id='Users'>
        <h2>Users</h2>
        <AdminUserList />
      </div>
    );
  }
}