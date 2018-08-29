import React from 'react';
import { inject, observer } from 'mobx-react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

@inject('userStore', 'commonStore', 'gatelistStore')
@observer
export class GatelistListItem extends React.Component {

  gatelistId = this.props.gatelist.gatelistId;
  groupName = this.props.gatelist.groupName;
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
        {<GroupNameCell adminView={this.props.adminView} groupName={this.groupName} />}
        <td>{this.firstName} {this.lastName}</td>
        <td width='10%'>{this.minor}</td>
        <td width='25%'>{this.notes}</td>
        <td width='15%'>
          <EditButtons adminView={this.props.adminView} handleEditClick={this.handleEditClick} handleDeleteClick={this.handleDeleteClick} />
        </td>
      </tr>
    );
  }
}

const GroupNameCell = (props) => {
  if (props.adminView){
    return (
      <td width='20%'>{props.groupName}</td>
    );
  }
  else {
    return null;
  }
};

const EditButtons = (props) => {
  if (props.adminView === false){
    const handleEditClick = props.handleEditClick;
    const handleDeleteClick = props.handleDeleteClick;
    return (
      <div className="form-group gatelist-form-controls">
        <button className='btn btn-sm' onClick={handleEditClick}><EditIcon className='icon edit-icon' /></button>
        <button className='btn btn-sm' onClick={handleDeleteClick}><DeleteForeverIcon className='icon delete-icon' /></button>
      </div>
    );
  }
  else {
    return (
      <span>&nbsp;</span>
    );
  }
};