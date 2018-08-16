import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('userStore', 'commonStore')
@observer
export class GatelistForm extends React.Component {
  render() {
    return (
      <form>

        <button
          onClick={this.handleSubmitForm}
          type="button"
          disabled={inProgress}
          className="btn btn-sm"
          style={btnStyle}
        >
          Sign in
        </button>
      </form>
    );
  }
}