import React from 'react';
import { inject, observer } from 'mobx-react';
import './style.css';
import {GatelistListItem} from "./GatelistListItem";

@inject('userStore', 'groupStore', 'gatelistStore')
@observer
export class GatelistList extends React.Component {

  render() {
    const week = this.props.week;
    const gatelist = this.props.gatelistStore.getGatelistEntriesForWeek(week);
    const numSavedGatelist = this.props.gatelistStore.getNumSavedGatelistForWeek;

    let savedGatelistForPrinting = [];
    if (numSavedGatelist > 0){
      savedGatelistForPrinting = gatelist.map((gl, index) => {
        return <GatelistListItem key={index} index={index} gatelist={gl} />;
      });
    }

    return (
      <div id='GatelistList'>
        <table className='table gatelist-table'>
          <thead>
            <tr>
              <th colSpan='2'>Name</th>
              <th>Minor?</th>
              <th>Notes</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
          {savedGatelistForPrinting}
          </tbody>
        </table>
      </div>
    );
  }
}