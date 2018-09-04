import { observable, action } from 'mobx';
import agent from '../agent';

class SettingStore {

  @observable loadingSettings = false;
  @observable isSavingSettings = false;

  @observable settingValues = {
    settingsId: '',
    startWeekend: 0,
    numWeeks: 6,
    defaultNumGLSlots: 10
  };

  @observable errors;

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

  @action saveSettings() {
    this.isSavingSettings = true;
    return agent.Settings
      .editSettings(this.settingValues.settingsId, this.settingValues)
      .catch(action('saveSettings error', (err) => {
        this.isSavingSettings = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('saveSettings finally', () => {
        this.isSavingSettings = false;
      }));
  }

}

export default new SettingStore();