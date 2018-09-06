import React from "react";
import { inject, observer } from 'mobx-react';
import {SettingsForm} from "../SettingsForm";

@inject('gatelistStore', 'interfaceStore', 'settingStore')
@observer
export default class AdminSettings extends React.Component {

  componentDidMount(){
    this.props.settingStore.loadSettings();
  }

  render(){
    return (
      <div id='AdminSettings'>
        <h2>Manage Settings</h2>
        <SettingsForm />
      </div>
    );
  }
}
