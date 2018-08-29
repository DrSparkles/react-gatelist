import React from 'react';
import { inject, observer } from 'mobx-react';
import './style.css';
import {GatelistListItem} from "./GatelistListItem";

@inject('userStore', 'groupStore', 'gatelistStore')
@observer
export class GatelistList extends React.Component {

  render() {

    const { week, gatelistData } = this.props;

    let savedGatelistForPrinting = [];
    if (gatelistData.length > 0){
      savedGatelistForPrinting = gatelistData.map((gl, index) => {
        return <GatelistListItem key={index} week={week} index={index} gatelist={gl} adminView={this.props.adminView} />;
      });
    }

    let header = <NormalHeader />;
    if (this.props.adminView){
      header = <AdminHeader />;
    }

    return (
      <div id='GatelistList'>
        <table className='table gatelist-table'>
          {header}
          <tbody>
          {savedGatelistForPrinting}
          </tbody>
        </table>
      </div>
    );
  }
}

const AdminHeader = () => {
  return (
    <thead>
      <tr>
        <th>Guild</th>
        <th>Name</th>
        <th>Minor?</th>
        <th>Notes</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
  );
};

const NormalHeader = () => {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Minor?</th>
        <th>Notes</th>
        <th>&nbsp;</th>
      </tr>
    </thead>
  );
};