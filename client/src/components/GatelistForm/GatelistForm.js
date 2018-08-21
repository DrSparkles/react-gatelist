import React from 'react';
import { inject, observer } from 'mobx-react';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import './style.css';
import {GatelistFormFields} from "./GatelistFormFields";

@inject('userStore', 'groupStore', 'gatelistStore', 'interfaceStore')
@observer
export class GatelistForm extends React.Component {

  week = this.props.week;
  numSavedGLValues = this.props.gatelistStore.getNumSavedGatelistForWeek(this.week);
  numGLSlots = this.props.groupStore.currentGroup.numGLSlots;

  handleAddGLClick = (ev) => {
    this.props.gatelistStore.addGLEntry = true;

  };

  renderGLForm = () => {
    if (this.props.gatelistStore.addGLEntry || this.props.gatelistStore.editGLEntry){
      const gatelist = this.props.gatelistStore.currentGatelist;
      if (this.props.interfaceStore.workingWithWeek === this.week){
        return (
          <GatelistFormFields index='0' week={this.week} gatelist={gatelist} />
        );
      }
      else {
        return null;
      }
    }
  };

  isAddBtnDisabled = () => {
    return (this.props.gatelistStore.addGLEntry ||
            this.props.gatelistStore.editGLEntry ||
            this.numSavedGLValues === this.numGLSlots);
  };

  render() {

    return (
      <div id='GatelistForm'>
        <button disabled={this.isAddBtnDisabled()} onClick={this.handleAddGLClick} className='btn btn-sm'><PersonAddIcon /></button>
        <span>{this.numSavedGLValues} / {this.numGLSlots} saved gatelist members</span>
        <div id='gatelist-form-container'>
          {this.renderGLForm()}
        </div>
      </div>
    );
  }
}