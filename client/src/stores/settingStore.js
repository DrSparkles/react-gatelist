import { observable, action, computed } from 'mobx';
import agent from '../agent';
import moment from "moment";

class SettingStore {

  @observable loadingSettings = false;
  @observable isSavingSettings = false;

  @observable newSettingValues = {
    settingsId: '',
    startWeekend: '',
    numWeeks: '',
    defaultNumGLSlots: ''
  };

  @observable settingValues = {
    settingsId: '',
    startWeekend: 0,
    numWeeks: 6,
    defaultNumGLSlots: 10
  };

  @observable errors;

  @computed get simpleNewStartWeek(){
    return moment(this.settingValues.startWeekend).format('YYYY-MM-DD');
  }

  @action setNewSettingValues(){
    this.newSettingValues.settingsId = this.settingValues.settingsId;
    this.newSettingValues.startWeekend = this.settingValues.startWeekend;
    this.newSettingValues.numWeeks = this.settingValues.numWeeks;
    this.newSettingValues.defaultNumGLSlots = this.settingValues.defaultNumGLSlots;
  }

  /**
   * @returns {Promise<any>}
   */
  @action loadSettings() {
    this.loadingSettings = true;
    return agent.Settings
      .getSiteSettings()
      .then(action('loadSettings then', (settings) => {
        const settingData = settings.result[0];
        this.settingValues.settingsId = settingData._id;
        this.settingValues.startWeekend = settingData.startWeekend;
        this.settingValues.numWeeks = settingData.numWeeks;
        this.settingValues.defaultNumGLSlots = settingData.defaultNumGLSlots;
      }))
      .catch(action('loadSettings error', (err) => {
        this.loadingSettings = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('loadSettings finally', () => {
        this.loadingSettings = false;
        this.setNewSettingValues();
        console.log('finished loading settings', this.settingValues);
        console.log(this.settingValues.defaultNumGLSlots);
      }));
  }

  @action setSettingData(settingData){
    this.settingValues.settingsId = settingData._id;
    this.settingValues.startWeekend = settingData.startWeekend;
    this.settingValues.numWeeks = settingData.numWeeks;
    this.settingValues.defaultNumGLSlots = settingData.defaultNumGLSlots;
  }

  @action editSettings() {
    this.isSavingSettings = true;
    return agent.Settings
      .editSettings(this.settingValues.settingsId, this.newSettingValues)
      .catch(action('editSettings error', (err) => {
        this.isSavingSettings = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('editSettings finally', () => {
        this.isSavingSettings = false;
      }));
  }

}

export default new SettingStore();