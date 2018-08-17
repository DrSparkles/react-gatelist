import { observable, action, computed, values } from 'mobx';
import agent from '../agent';
import { GatelistEntry } from './dataStores/GatelistEntry';
import groupStore from './groupStore';
import userStore from './userStore';

class GatelistStore {

  @observable currentGatelist = {
    gatelistId: 0,
    firstName: '',
    lastName: '',
    date: '',
    minor: null,
    notes: '',
    groupId: 0,
    createdDate: '',
    addedBy: 0
  };

  @observable gatelist = observable.map();

  @observable loadingGatelist = false;

  @observable errors;

  @action loadUsersGatelist() {
    this.loadingGatelist = true;
    return agent.Gatelist
      .getUserGatelist()
      .then(action((gatelist) => {
        console.log('groups in loadUsersGatelist', gatelist);
        this.gatelist.clear();
        const userGatelistData = gatelist.result;
        this.setUserGatelist(userGatelistData);
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.loadingGatelist = false;
      }));
  }

  setUserGatelist(userGatelistData){
    userGatelistData.forEach((gatelist) => {
      this.gatelist.set(
        gatelist._id,
        new GatelistEntry(
          gatelist._id,
          gatelist.firstName,
          gatelist.lastName,
          gatelist.date,
          gatelist.minor,
          gatelist.notes,
          gatelist.groupId,
          gatelist.createdDate,
          gatelist.addedBy
        ));
    });
  }

  @action saveGatelist(){
    if (this.newGatelist.groupName !== ""){
      return this.saveNewGatelist();
    }
    else {
      return this.editGatelist();
    }
  }

  @action saveNewGatelist(){
    this.isSavingGatelist = true;
    const saveData = {
      firstName: this.currentGatelist.firstName,
      lastName: this.currentGatelist.lastName,
      date: this.currentGatelist.date,
      minor: this.currentGatelist.minor,
      notes: this.currentGatelist.notes,
      groupId: groupStore.currentGroup.groupId,
      addedBy: userStore.currentUser.userId
    };

    return agent.Gatelist
      .createNew(saveData)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.clearNewSaveData();
        this.loadUsersGatelist()
          .finally(() => {
            this.isSavingGatelist = false;
          });
      }));
  }

  @action editGatelist(){
    this.isSavingGatelist = true;
    return agent.Gatelist
      .editGatelist(this.currentGatelist.gatelistId, this.currentGatelist)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.isSavingGatelist = false;
      }));
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

  clearCurrentGroup(){
    this.currentGatelist = {
      gatelistId: 0,
      firstName: '',
      lastName: '',
      date: '',
      minor: null,
      notes: '',
      groupId: 0,
      createdDate: '',
      addedBy: 0
    };
  }

  clearNewSaveData(){
    this.newGatelist = {
      firstName: '',
      lastName: '',
      date: '',
      minor: null,
      notes: '',
      groupId: 0,
      createdDate: '',
      addedBy: 0
    };
  }

}

export default new GatelistStore();