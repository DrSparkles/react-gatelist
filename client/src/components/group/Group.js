import React from "react";
import { inject, observer } from 'mobx-react';
import ListErrors from "../ListErrors";
import queryString from 'query-string';

@inject('groupStore', 'routerStore')
@observer
export default class Group extends React.Component {

  componentWillMount(){
    const parsed = queryString.parse(this.props.routerStore.location.pathname);
    console.log('parsed', parsed);

    console.log('routerStore', this.props.routerStore);
    console.log('props', this.props);
    console.log('match', this.props.match);
    console.log('location', this.props.location);

    const groupId = '';
    this.props.groupStore.loadCurrentGroup(groupId);
  }

  handleGroupName = (ev) => {
    this.props.groupStore.newGroup.groupName = ev.target.value;
  };

  handleSubmitForm = (ev) => {
    ev.preventDefault();

    // do not allow saving if the fields are blank
    // visual differentiation on the save button would be handy...
    const groupName = this.props.groupStore.newGroup.groupName || this.props.groupStore.currentGroup.groupName;
    if (groupName === ""){
      return false;
    }

    this.props.listRegistryStore.saveList()
    // this isn't loading when I expect; needs sorting out!
      .then(() => {
        if (this.props.switchToList && this.props.listRegistryStore.newListId){
          this.props.history.push("/list/" + this.props.listRegistryStore.newListId);
          this.props.listRegistryStore.newListId = undefined;
        }
      });
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