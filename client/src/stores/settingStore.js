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
      .then(action((settings) => {
        const settingData = settings.result;
        this.settingValues.settingsId = settingData._id;
        this.settingValues.startWeekend = settingData.startWeekend;
        this.settingValues.numWeeks = settingData.numWeeks;
        this.settingValues.defaultNumGLSlots = settingData.defaultNumGLSlots;
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.loadingSettings = false;
      }));
  }

  @action saveSettings() {
    this.isSavingSettings = true;
    return agent.Settings
      .editSettings(this.settingValues.settingsId, this.settingValues)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.isSavingSettings = false;
      }));
  }

}

export default new SettingStore();