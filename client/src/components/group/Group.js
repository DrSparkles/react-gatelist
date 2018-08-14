import React from "react";
import { inject, observer } from 'mobx-react';
import ListErrors from "../ListErrors";

@inject('groupStore')
@observer
export default class Group extends React.Component {

  constructor(props){
    super(props);
  }

  componentWillMount(){
    // const parsed = queryString.parse(this.props.location);
    // console.log('parsed', parsed);

    console.log('props', this.props);
    console.log('match', this.props.match);
    console.log('location', this.props.location);

    const groupId = '';
    this.props.groupStore.loadCurrentGroup(groupId);
  }

  handleGroupName = () => {

  };

  handleSubmitForm = () => {

  };

  render(){

    const { currentGroup, errors, inProgress } = this.props.groupStore;

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
                  value={currentGroup.groupName}
                  onChange={this.handleGroupName}
                  className="form-control form-control-sm"
                />
              </div>

              <input type='hidden' name='numGLSlots' value='currentGroup.numGLSlots' />

              <div className="form-group text-center">
                <button
                  onClick={this.handleSubmitForm}
                  type="button"
                  disabled={inProgress}
                  className="btn btn-sm">
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