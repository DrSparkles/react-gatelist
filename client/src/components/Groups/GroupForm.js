import React from "react";
import { inject, observer } from 'mobx-react';
import ListErrors from "../ListErrors";
import './style.css';

@inject('groupStore', 'routerStore', 'userStore', 'settingStore')
@observer
export class GroupForm extends React.Component {

  componentWillMount(){
    const path = this.props.routerStore.location.pathname;
    const pathPieces = path.split("/");
    console.log('GroupForm path', path);
    console.log('GroupForm path pieces', pathPieces);

    const groupId = (pathPieces.length > 2) ? pathPieces[pathPieces.length - 1] : '';
    this.props.groupStore.loadCurrentGroup(groupId);
  }

  handleGroupName = (ev) => {
    this.props.groupStore.newGroup.groupName = ev.target.value;
  };

  handleSubmitForm = (ev) => {
    ev.preventDefault();

    // do not allow saving if the fields are blank
    // visual differentiation on the save button would be handy...
    const groupName = this.props.groupStore.newGroup.groupName;
    if (groupName === ""){
      return false;
    }

    this.props.groupStore.currentGroup.numGLSlots = this.props.settingStore.settingValues.defaultNumGLSlots;
    this.props.groupStore.currentGroup.userId = this.props.userStore.currentUser.userId;

    this.props.groupStore.saveGroup()
      .then(() => {
        // if (this.props.switchToList && this.props.listRegistryStore.newListId){
        //   this.props.history.push("/list/" + this.props.listRegistryStore.newListId);
        //   this.props.listRegistryStore.newListId = undefined;
        // }
      });
  };

  render(){

    const { errors, inProgress } = this.props.groupStore;

    return (
      <div id='GroupForm'>
        <div className="row">

          <div className="col-md-6 offset-md-3 col-xs-12">

            <ListErrors errors={errors} />

            <form>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={this.props.groupStore.newGroup.groupName}
                  onChange={this.handleGroupName}
                  className="form-control form-control-sm"
                />
              </div>

              <input type='hidden' id='numGLSlots' name='numGLSlots' value={this.props.groupStore.newGroup.numGLSlots} />

              <div className="form-group text-center">
                <button
                  onClick={this.handleSubmitForm}
                  type="button"
                  disabled={inProgress}
                  className="btn-text btn btn-sm group-save-button">
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