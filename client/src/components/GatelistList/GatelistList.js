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
    console.log('GatelistList gatelist', gatelist);
    let savedGatelistForPrinting = [];
    if (gatelist.length > 0){
      savedGatelistForPrinting = gatelist.map((gl, index) => {
        console.log(gl);
        return <GatelistListItem key={index} week={week} index={index} gatelist={gl} />;
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