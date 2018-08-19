import React from 'react';
import { inject, observer } from 'mobx-react';
import EditIcon from '@material-ui/icons/Edit';

@inject('userStore', 'commonStore')
@observer
export class GatelistListItem extends React.Component {

  firstName = this.props.gatelist.firstName;
  lastName = this.props.gatelist.lastName;
  date = this.props.gatelist.date;
  minor = (this.props.gatelist.minor) ? 'Minor' : '';
  notes = this.props.gatelist.notes;

  getFieldId(name, index){
    return name + "_" + index;
  }

  render() {

    console.log(this.props.gatelist);
    return (
      <tr className='gatelist-row'>
        <td colSpan='2'>{this.firstName} {this.lastName}</td>
        <td>{this.minor}</td>
        <td>{this.notes}</td>
        <td>
          <EditIcon className='icon edit-icon' />
        </td>
      </tr>
    );
  }
}