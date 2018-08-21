import React from 'react';
import { inject, observer } from 'mobx-react';
import SaveIcon from '@material-ui/icons/Save';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

@inject('userStore', 'commonStore', 'gatelistStore')
@observer
export class GatelistFormFields extends React.Component {

  handleFirstnameChange = (ev) => {
    this.props.gatelistStore.currentGatelist.firstName = ev.target.value;
  };

  handleLastnameChange = (ev) => {
    this.props.gatelistStore.currentGatelist.lastName = ev.target.value;
  };

  handleMinorChange = (ev) => {
    this.props.gatelistStore.currentGatelist.minor = ev.target.checked;
  };

  handleNotesChange = (ev) => {
    this.props.gatelistStore.currentGatelist.notes = ev.target.value;
  };

  handleCancelChangeBtn = (ev) => {
    ev.preventDefault();
    console.log('Calcel Edit!!');
    this.props.gatelistStore.addGLEntry = false;
    this.props.gatelistStore.editGLEntry = false;
    this.props.gatelistStore.clearCurrentGroup();
  };

  handleSaveChangeBtn = (ev) => {
    ev.preventDefault();
    this.props.gatelistStore.currentGatelist.date = this.props.week;
    if (this.props.gatelist.gatelistId){
      this.props.gatelistStore.currentGatelist.gatelistId = this.props.gatelist.gatelistId;
    }

    console.log('gatelist to save', this.props.gatelistStore.currentGatelist);

    this.props.gatelistStore.saveGatelist();
    this.props.gatelistStore.addGLEntry = false;
    this.props.gatelistStore.editGLEntry = false;

    console.log('Save Edit!!');
  };

  getFieldId(name, index){
    return name + "_" + index;
  }

  render() {

    const index = this.props.index;
    const { firstName, lastName, minor, notes } = this.props.gatelist;
    console.log('gatelistformfields gatelist', this.props.gatelist);
    return (
      <form className='form-inline gatelist-form-fields'>
        <table className='gatelist-form-table'>
          <tbody>
            <tr>
              <td>
                <div className="form-group">
                  <label className="sr-only" htmlFor={this.getFieldId('firstName', index)}>Firstname</label>
                  <input
                    id={this.getFieldId('firstName', index)}
                    type="text"
                    placeholder="Firstname"
                    value={firstName}
                    onChange={this.handleFirstnameChange}
                    className="form-control form-control-sm"
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <label className="sr-only" htmlFor={this.getFieldId('lastName', index)}>Lastname</label>
                  <input
                    id={this.getFieldId('lastName', index)}
                    type="text"
                    placeholder="Lastname"
                    value={lastName}
                    onChange={this.handleLastnameChange}
                    className="form-control form-control-sm"
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <label className="form-label" htmlFor={this.getFieldId('minor', index)}>Minor?</label>
                  <input
                    id={this.getFieldId('minor', index)}
                    type="checkbox"
                    placeholder="Minor"
                    checked={minor}
                    onChange={this.handleMinorChange}
                    className="form-control form-control-sm"
                  />
                </div>
              </td>
              <td>
                <div className="form-group">
                  <label className="sr-only" htmlFor={this.getFieldId('notes', index)}>Notes</label>
                  <textarea
                    id={this.getFieldId('notes', index)}
                    placeholder="Notes"
                    onChange={this.handleNotesChange}
                    value={notes}
                    className="form-control form-control-sm"
                  />
                </div>
              </td>
              <td>
                <div className="form-group gatelist-form-controls">
                  <button onClick={this.handleSaveChangeBtn} className='btn btn-sm'><SaveIcon className='icon save-icon'/></button>
                  <button onClick={this.handleCancelChangeBtn} className='btn btn-sm'><NotInterestedIcon className='icon cancel-icon'/></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  }
}