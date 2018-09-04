import { observable, action } from 'mobx';
import agent from '../agent';
import { GatelistEntry } from './dataStores/GatelistEntry';
import groupStore from './groupStore';
import userStore from './userStore';
import settingStore from './settingStore';
import moment from "moment";

class GatelistStore {

  @observable editGLEntry = false;

  @observable addGLEntry = false;

  @observable loadingGatelist = false;

  @observable deleteGatelistId = null;

  @observable errors;

  @observable gatelist = {};

  @observable gatelistByWeek = {};

  @observable deleting;

  @observable currentGatelist = {
    gatelistId: null,
    firstName: '',
    lastName: '',
    date: '',
    minor: false,
    notes: ''
  };

  @action setCurentGatelist = (week, gatelistId) => {
    if (this.gatelist[week] !== undefined && this.gatelist[week][gatelistId] !== undefined){
      const gatelist = this.gatelist[week][gatelistId];
      this.currentGatelist.gatelistId = gatelist.gatelistId;
      this.currentGatelist.firstName = gatelist.firstName;
      this.currentGatelist.lastName = gatelist.lastName;
      this.currentGatelist.date = gatelist.date;
      this.currentGatelist.minor = gatelist.minor;
      this.currentGatelist.notes = gatelist.notes;
    }
    return null;
  };

  getNumSavedGatelistForWeek(week){
    console.log('getNumSavedGatelistForWeek week', week);
    console.log('getNumSavedGatelistForWeek this.gatelist', this.gatelist);
    const gl = this.gatelist[week];
    console.log("getNumSavedGatelistForWeek gl", gl);
    if (gl !== undefined){
      const glValues = Object.values(gl);
      return glValues.length;
    }
    return 0;
  }

  getGatelistEntriesForWeek(week){
    const gl = this.gatelist[week];
    if (gl !== undefined){
      return Object.values(gl);
    }
    return [];
  }

  /**
   * Load the gatelist for a given group
   * @returns {*|Promise<any>|Promise<T>}
   */
  @action loadGroupsGatelist(){
    this.loadingGatelist = true;
    return agent.Gatelist
      .getGroupsGatelist(groupStore.currentGroup.groupId)
      .then(action('loadGroupsGatelist then', (gatelist) => {
        this.gatelist = this.setupGatelist(
          this.gatelist,
          settingStore.settingValues.startWeekend,
          settingStore.settingValues.numWeeks
        );
        const userGatelistData = gatelist.result;
        this.gatelist = this.parseGatelistValues(this.gatelist, userGatelistData);
      }))
      .catch(action('loadGroupsGatelist error', (err) => {
        this.loadingGatelist = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('loadGroupsGatelist finally', () => {
        this.loadingGatelist = false;
      }));
  }

  /**
   * Load the complete gatelist for a given week, for the admin view
   * @param week
   * @returns {*|Promise<any>|Promise<T>}
   */
  @action loadGatelistForWeek(week){

    this.loadingGatelist = true;
    return agent.Gatelist
      .getGatelistForWeek(week)
      .then(action('loadGatelistForWeek then', (gatelist) => {
        this.gatelistByWeek = this.setupGatelist(
          this.gatelistByWeek,
          settingStore.settingValues.startWeekend,
          settingStore.settingValues.numWeeks
        );
        const weekGatelistData = gatelist.result;
        this.gatelistByWeek = this.parseGatelistValues(this.gatelistByWeek, weekGatelistData);
        console.log('loadGatelistForWeek', this.gatelistByWeek);
      }))
      .catch(action('loadGatelistForWeek error', (err) => {
        this.loadingGatelist = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('loadGatelistForWeek finally', () => {
        this.loadingGatelist = false;
      }));
  }

  @action setupGatelist(gatelistHash, startWeekend, numWeeks){
    for (let i = 0; i < numWeeks; i++){
      const week = moment(startWeekend).add(i, 'weeks').format('YYYY-MM-DD');
      gatelistHash[week] = {};
    }
    return gatelistHash;
  }

  @action parseGatelistValues(gatelistHash, gatelistData){

    for (let week in gatelistData){
      if (gatelistData.hasOwnProperty(week)) {
        const weeksList = gatelistData[week];
        for (let i = 0; i < weeksList.length; i++){
          const gatelist = weeksList[i];
          const glEntry = new GatelistEntry(
                gatelist._id,
                gatelist.groupName,
                gatelist.firstName,
                gatelist.lastName,
                gatelist.date,
                gatelist.minor,
                gatelist.notes,
                gatelist.groupId,
                gatelist.createdDate,
                gatelist.addedBy
              );

          gatelistHash[week][gatelist._id] = glEntry;
        }
      }
    }
    return gatelistHash;
  }

  @action saveGatelist(){
    if (!this.currentGatelist.gatelistId){
      console.log('save new gatelist');
      return this.saveNewGatelist();
    }
    else {
      console.log('editing existing gatelist!');
      return this.editGatelist();
    }
  }

  @action saveNewGatelist(){
    this.isSavingGatelist = true;

    const saveData = this.getSaveData();
    console.log('saveData', saveData);
    return agent.Gatelist
      .saveGatelist(saveData)
      .catch(action('saveNewGatelist error', (err) => {
        this.isSavingGatelist = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('saveNewGatelist finally', () => {
        this.clearCurrentGroup();
        this.loadGroupsGatelist()
          .finally(() => {
            this.isSavingGatelist = false;
          });
      }));
  }

  @action editGatelist(){
    this.isSavingGatelist = true;
    const saveData = this.getSaveData();
    saveData.gatelistId = this.currentGatelist.gatelistId;
    console.log('saving this data!', saveData);
    return agent.Gatelist
      .editGatelist(this.currentGatelist.gatelistId, saveData)
      .catch(action('saveNewGatelist error', (err) => {
        this.isSavingGatelist = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('saveNewGatelist finally', () => {
        this.clearCurrentGroup();
        this.loadGroupsGatelist()
          .finally(() => {
            this.isSavingGatelist = false;
          });
      }));
  }

  getSaveData(){
    console.log('userStore.currentUser.userId', userStore.currentUser);
    return {
      firstName: this.currentGatelist.firstName,
      lastName: this.currentGatelist.lastName,
      date: this.currentGatelist.date,
      minor: this.currentGatelist.minor,
      notes: this.currentGatelist.notes,
      groupId: groupStore.currentGroup.groupId,
      groupName: groupStore.currentGroup.groupName,
      addedBy: userStore.currentUser.userId
    };
  }

  @action deleteGatelist(){
    this.deleting = true;
    return agent.Gatelist
      .deleteGatelist(this.deleteGatelistId)
      .catch(action('deleteGatelist error', (err) => {
        this.deleting = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('deleteGatelist finally', () => {
        if (this.deleteGatelistId === this.currentGatelist.gatelistId){
          this.clearCurrentGroup();
        }
        this.deleteGatelistId = '';
        this.loadGroupsGatelist();
        this.deleting = false;
      }));
  }

  @action clearCurrentGroup(){
    this.currentGatelist = {
      gatelistId: 0,
      firstName: '',
      lastName: '',
      date: '',
      minor: false,
      notes: ''
    };
  }
}

export default new GatelistStore();