import React from 'react';
import { inject, observer } from 'mobx-react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
// import moment from "moment";

import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import './style.css';

@inject('settingStore')
@observer
export class SettingsForm extends React.Component {

  handleChangeStartWeekend = (ev) =>{
    this.props.settingStore.newSettingValues.startWeekend = ev.target.value;
  };

  handleChangeNumWeeks = (ev) => {
    // console.log('num weeks', ev.target.value);
    this.props.settingStore.newSettingValues.numWeeks = ev.target.value;
    // console.log('this.props.settingStore.newSettingValues.numWeeks', this.props.settingStore.newSettingValues.numWeeks);
  };

  handleChangeDefaultNumGLSlots = (ev) => {
    // console.log('default num gl slots', ev.target.value);
    this.props.settingStore.newSettingValues.defaultNumGLSlots = ev.target.value;
    // console.log('this.props.settingStore.newSettingValues.defaultNumGLSlots', this.props.settingStore.newSettingValues.defaultNumGLSlots);
  };

  handleSaveSettings = (ev) => {
    ev.preventDefault();
    this.props.settingStore.newSettingValues.settingsId = this.props.settingStore.settingValues.settingsId;
    this.props.settingStore.editSettings();
  };

  render() {

    if (this.props.settingStore.loadingSettings){
      return(
        <LoadingSpinner/>
      );
    }
    else {
      return (
        <div id='SettingsForm'>

          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">

              <form>
                <div className="form-group">
                  <label htmlFor='faire-start-date'>Faire Start Date (format yyyy-mm-dd)</label>
                  <input
                    id='faire-start-date'
                    type="text"
                    placeholder="Faire Start Date"
                    value={this.props.settingStore.simpleNewStartWeek}
                    onChange={this.handleChangeStartWeekend}
                    className="form-control form-control-sm"
                  />

                  <label htmlFor='num-faire-weeks'>Number of Faire Weeks</label>
                  <input
                    id='num-faire-weeks'
                    type="text"
                    placeholder="Number of Faire Weeks"
                    value={this.props.settingStore.newSettingValues.numWeeks}
                    onChange={this.handleChangeNumWeeks}
                    className="form-control form-control-sm"
                  />

                  <label htmlFor='default-num-slots'>Default Number of Slots</label>
                  <input
                    id='default-num-slots'
                    type="text"
                    placeholder="Default Number of Slots"
                    value={this.props.settingStore.newSettingValues.defaultNumGLSlots}
                    onChange={this.handleChangeDefaultNumGLSlots}
                    className="form-control form-control-sm"
                  />
                </div>

                <div className="form-group text-center">
                  <button
                    type="button"
                    disabled={this.props.settingStore.loadingSettings}
                    className="btn btn-sm btn-text"
                    onClick={this.handleSaveSettings}>
                    Save
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}