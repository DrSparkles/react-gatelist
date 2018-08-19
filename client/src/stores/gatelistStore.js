import { observable, action, computed } from 'mobx';
import agent from '../agent';
import { GatelistEntry } from './dataStores/GatelistEntry';
import groupStore from './groupStore';
import userStore from './userStore';
import settingStore from './settingStore';
import moment from "moment";

class GatelistStore {

  @observable editGLEntry = null;

  @observable addGLEntry = false;

  @observable loadingGatelist = false;

  @observable errors;

  @observable gatelist = {};

  @observable currentGatelist = {
    gatelistId: null,
    firstName: '',
    lastName: '',
    date: '',
    minor: false,
    notes: ''
  };

  getNumSavedGatelistForWeek(week){
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

  @action loadGroupsGatelist(){
    this.loadingGatelist = true;
    return agent.Gatelist
      .getGroupsGatelist(groupStore.currentGroup.groupId)
      .then(action((gatelist) => {
        this.gatelist = this.setupGatelist(
          this.gatelist,
          settingStore.settingValues.startWeekend,
          settingStore.settingValues.numWeeks
        );
        const userGatelistData = gatelist.result;
        console.log('loadGroupsGatelist gatelist', gatelist);
        console.log('loadGroupsGatelist gatelist.result', gatelist.result);
        this.gatelist = this.setGroupsGatelistValues(this.gatelist, userGatelistData);
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.loadingGatelist = false;
      }));
  }

  setupGatelist(gatelistHash, startWeekend, numWeeks){
    for (let i = 0; i < numWeeks; i++){
      const week = moment(startWeekend).add(i, 'weeks').format('YYYY-MM-DD');
      gatelistHash[week] = {};
    }
    console.log('setupGatelist gatelistHash', gatelistHash);
    return gatelistHash;
  }

  setGroupsGatelistValues(gatelistHash, gatelistData){

    for (let week in gatelistData){
      if (gatelistData.hasOwnProperty(week)) {
        const weeksList = gatelistData[week];
        console.log('setGroupsGatelistValues week', week);
        console.log('setGroupsGatelistValues weeksList', weeksList);
        for (let i = 0; i < weeksList.length; i++){
          const gatelist = weeksList[i];
          console.log('setGroupsGatelistValues gatelist', gatelist);
          const glEntry = new GatelistEntry(
                gatelist._id,
                gatelist.firstName,
                gatelist.lastName,
                gatelist.date,
                gatelist.minor,
                gatelist.notes,
                gatelist.groupId,
                gatelist.createdDate,
                gatelist.addedBy
              );

          gatelistHash[week][gatelist.gatelistId] = glEntry;
        }
      }
    }
    console.log('setGroupsGatelistValues gatelistHash', gatelistHash);
    return gatelistHash;
  }

  @action saveGatelist(){
    if (this.currentGatelist.gatelistId === null){
      console.log('save new gatelist');
      return this.saveNewGatelist();
    }
    else {
      return this.editGatelist();
    }
  }

  @action saveNewGatelist(){
    this.isSavingGatelist = true;

    const saveData = this.getSaveData();
    console.log('saveData', saveData);
    return agent.Gatelist
      .saveGatelist(saveData)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
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
    return agent.Gatelist
      .editGatelist(this.currentGatelist.gatelistId, saveData)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.clearCurrentGroup();
        this.loadGroupsGatelist()
          .finally(() => {
            this.isSavingGatelist = false;
          });
      }));
  }

  getSaveData(){
    return {
      firstName: this.currentGatelist.firstName,
      lastName: this.currentGatelist.lastName,
      date: this.currentGatelist.date,
      minor: this.currentGatelist.minor,
      notes: this.currentGatelist.notes,
      groupId: groupStore.currentGroup.groupId,
      addedBy: userStore.currentUser.userId
    };
  }

  @action deleteGatelist(){
    return agent.Groups
      .deleteGatelist(this.deleteGatelistId)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        if (this.deleteGatelistId === this.currentGatelist.gatelistId){
          this.clearCurrentGroup();
        }
        this.deleteGatelistId = '';
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

  /*
  getBlankGatelist(){
    return {
      gatelistId: null,
      firstName: '',
      lastName: '',
      date: '',
      minor: false,
      notes: ''
    };
  }

  @action loadUsersGatelist() {
    this.loadingGatelist = true;
    return agent.Gatelist
      .getUserGatelist(groupStore.currentGroup.groupId)
      .then(action((gatelist) => {
        console.log('loadUsersGatelist gatelist', gatelist);
        console.log('loadUsersGatelist gatelist.result', gatelist.result);

        this.gatelist.clear();
        const userGatelistData = gatelist.result;

        this.setUserGatelist(userGatelistData);
        console.log('loadUsersGatelist userGatelistData', userGatelistData);

      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.loadingGatelist = false;
      }));
  }

*/
}

export default new GatelistStore();