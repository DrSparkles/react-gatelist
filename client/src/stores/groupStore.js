import { observable, action, computed, values } from 'mobx';
import agent from '../agent';
import Group from './dataStores/Group';
import settingStore from './settingStore';


class GroupStore {

  @observable editGroupEntry = false;

  @observable currentGroup = {
    groupId: 0,
    groupName: '',
    numGLSlots: 0,
    userId: ''
  };

  @observable usersGroups = observable.map();

  @observable allGroups = observable.map();

  @observable newGroup = {
    groupName: '',
    numGLSlots: 0,
    userId: ''
  };

  @observable loadingGroups = false;

  @observable errors;

  @observable deleteGroupId = '';

  @computed get getNumUserGroups(){
    return this.usersGroups.size;
  }

  @computed get getUserGroups(){
    return values(this.usersGroups);
  }

  @computed get getNumAllGroups() {
    return this.allGroups.size;
  }

  @computed get getAllGroups(){
    return values(this.allGroups);
  }

  /**
   * Given a group id, load the currenet group from the user group map
   * @param groupId
   */
  @action loadCurrentGroup(groupId){
    if (!groupId){
      this.currentGroup = {
        groupId: '',
        groupName: '',
        numGLSlots: '',
        userId: ''
      };
    }
    else {
      this.currentGroup = this.usersGroups.get(groupId);
    }
    return this.currentGroup;
  }

  /**
   * @returns {Promise<any>}
   */
  @action loadAllGroups() {
    this.loadingGroups = true;
    this.allGroups.clear();
    return agent.Groups
      .getAllGroups()
      .then(action((groups) => {
        console.log('groups in loadAllGroups', groups);
        const groupData = groups.result;
        console.log(groupData);
        this.setAllGroups(groupData);
        console.log(this.allGroups);
      }))
      .catch(action((err) => {
        this.loadingGroups = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.loadingGroups = false;
      }));
  }

  /**
   * @returns {Promise<any>}
   */
  @action loadUsersGroups() {
    this.loadingGroups = true;
    this.usersGroups.clear();
    return agent.Groups
      .getUsersGroups()
      .then(action((groups) => {
        console.log('groups in loadUsersGroups', groups);
        const userGroupData = groups.result;
        this.setUserGroups(userGroupData);
      }))
      .catch(action((err) => {
        this.loadingGroups = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.loadingGroups = false;
      }));
  }

  setAllGroups(groupData){
    this.allGroups.clear();
    groupData.forEach((group) => {
      this.allGroups.set(
        group._id,
        new Group(
          group._id,
          group.groupName,
          group.numGLSlots,
          group.department
        ));
    });
  }

  setUserGroups(userGroupData){
    this.usersGroups.clear();
    userGroupData.forEach((group) => {
      this.usersGroups.set(
        group._id,
        new Group(
          group._id,
          group.groupName,
          group.numGLSlots,
          group.department
        ));
    });
  }

  @action saveGroup(){
    if (this.newGroup.groupName !== ""){
      return this.saveNewGroup();
    }
    else {
      return this.editGroup();
    }
  }

  @action saveNewGroup(){
    this.isSavingGroup = true;
    const defaultNumGLSlots = settingStore.settingValues.defaultNumGLSlots;
    const saveData = {
      groupName: this.newGroup.groupName,
      numGLSlots: defaultNumGLSlots,
      userId: this.newGroup.userId,
      department: 'ent'
    };

    return agent.Groups
      .createNew(saveData)
      .catch(action((err) => {
        this.isSavingGroup = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.clearNewSaveData();
        this.loadUsersGroups()
          .finally(() => {
            this.isSavingGroup = false;
          });
      }));
  }

  @action editGroup(){
    this.isSavingGroup = true;
    return agent.Groups
      .editGroup(this.currentGroup.groupId, this.currentGroup)
      .catch(action((err) => {
        this.isSavingGroup = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.isSavingGroup = false;
      }));
  }

  @action deleteGroup(){
    return agent.Groups
      .deleteGroup(this.deleteGroupId)
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        // if (this.deleteGroupId === this.currentGroup.groupId){
        //   this.clearCurrentGroup();
        // }
        this.deleteGroupId = '';
      }));
  }

  clearNewSaveData(){
    this.newGroup = {
      groupName: '',
      numGLSlots: 0,
      userId: ''
    };
  }

  clearCurrentGroup(){
    this.currentGroup = {};
  }

}

export default new GroupStore();