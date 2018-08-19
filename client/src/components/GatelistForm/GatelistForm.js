import React from 'react';
import { inject, observer } from 'mobx-react';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import './style.css';
import {GatelistFormFields} from "./GatelistFormFields";

@inject('userStore', 'groupStore', 'gatelistStore')
@observer
export class GatelistForm extends React.Component {

  handleAddGLClick = (ev) => {
    console.log('Clicked to add!');
    this.props.gatelistStore.addGLEntry = true;
  };

  renderGLForm = () => {
    if (this.props.gatelistStore.addGLEntry){
      const week = this.props.week;
      const gatelist = this.props.gatelistStore.currentGatelist;
      return (
        <GatelistFormFields index='0' week={week} gatelist={gatelist} />
      );
    }
  };

  isAddBtnDisabled = () => {
    if (this.props.gatelistStore.addGLEntry){
      return true;
    }
    return false;
  };

  render() {

    const week = this.props.week;
    const numSavedGLValues = this.props.gatelistStore.getNumSavedGatelistForWeek(week);
    const numGLSlots = this.props.groupStore.currentGroup.numGLSlots;

    return (
      <div id='GatelistForm'>
        <button disabled={this.isAddBtnDisabled()} onClick={this.handleAddGLClick}><PersonAddIcon /></button>
        <span>{numSavedGLValues} / {numGLSlots} saved gatelist members</span>
        <div id='gatelist-form-container'>
          {this.renderGLForm()}
        </div>
      </div>
    );
  }
}