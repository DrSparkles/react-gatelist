import React from "react";
import { inject, observer } from 'mobx-react';
import ListErrors from "../ListErrors";

@inject('groupStore')
@observer
export default class Group extends React.Component {

  handleGroupName = () => {

  };

  handleSubmitForm = () => {

  };

  render(){

    const { values, errors, inProgress } = this.props.groupStore;
    return (
      <div>
        <div className="row">

          <div className="col-md-6 offset-md-3 col-xs-12">

            <ListErrors errors={errors} />

            <form>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={values.groupName}
                  onChange={this.handleGroupName}
                  className="form-control form-control-sm"
                />
              </div>

              <input type='text' name='' value='' />

              <div className="form-group text-center">
                <button
                  onClick={this.handleSubmitForm}
                  type="button"
                  disabled={inProgress}
                  className="btn btn-sm"
                >
                  Save Group
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
}