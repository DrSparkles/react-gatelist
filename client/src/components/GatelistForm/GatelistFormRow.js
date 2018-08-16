import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('userStore', 'commonStore')
@observer
export class GatelistFormRow extends React.Component {

  handleFirstnameChange = () => {

  };

  handleLastnameChange = () => {

  };

  handleMinorChange = () => {

  };

  handleNotesChange = () => {

  };

  render() {

    const { index, gatelistId, firstname, lastname, minor, notes } = this.props;

    return (
      <div className="form-group">
        <div className="form-group">
          <input
            type="text"
            placeholder="Firstname"
            value={values.email}
            onChange={this.handleFirstnameChange}
            className="form-control form-control-sm"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Lastname"
            value={values.email}
            onChange={this.handleLastnameChange}
            className="form-control form-control-sm"
          />
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            placeholder="Minor"
            value={values.email}
            onChange={this.handleMinorChange}
            className="form-control form-control-sm"
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Notes"
            onChange={this.handleNotesChange}
            className="form-control form-control-sm"
          ></textarea>
        </div>


      </div>

    );
  }
}