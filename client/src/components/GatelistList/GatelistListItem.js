import React from 'react';
import { inject, observer } from 'mobx-react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

@inject('userStore', 'commonStore', 'gatelistStore')
@observer
export class GatelistListItem extends React.Component {

  gatelistId = this.props.gatelist.gatelistId;
  firstName = this.props.gatelist.firstName;
  lastName = this.props.gatelist.lastName;
  date = this.props.gatelist.date;
  minor = (this.props.gatelist.minor) ? 'Minor' : '';
  notes = this.props.gatelist.notes;
  week = this.props.week;

  handleEditClick = (ev) => {
    ev.preventDefault();
    this.props.gatelistStore.setCurentGatelist(this.week, this.gatelistId);
    this.props.gatelistStore.editGLEntry = true;
  };

  handleDeleteClick = (ev) => {
    ev.preventDefault();
    this.props.gatelistStore.deleteGatelistId = this.gatelistId;
    this.props.gatelistStore.deleteGatelist();
  };

  render() {

    return (
      <tr className='gatelist-row'>
        <td colSpan='2'>{this.firstName} {this.lastName}</td>
        <td>{this.minor}</td>
        <td>{this.notes}</td>
        <td>
          <div className="form-group gatelist-form-controls">
            <button onClick={this.handleEditClick}><EditIcon className='icon edit-icon' /></button>
            <button onClick={this.handleDeleteClick}><DeleteForeverIcon className='icon delete-icon' /></button>
          </div>
        </td>
      </tr>
    );
  }
}