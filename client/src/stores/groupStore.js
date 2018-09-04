import { observable, action, computed, values } from 'mobx';
import agent from '../agent';
import Group from './dataStores/Group';
import settingStore from './settingStore';
import userStore from './userStore';
import messagingStore from "./messagingStore";


class GroupStore {

  @observable isSavingGroup = false;

  @observable deletingGroup = false;

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
    else if (userStore.isSuperAdmin && this.allGroups.get(groupId) !== undefined){
      this.currentGroup = this.allGroups.get(groupId);
    }
    else if (userStore.isUser && this.usersGroups.get(groupId) !== undefined){
      this.currentGroup = this.usersGroups.get(groupId);
    }
    else {
      return false;
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
      .then(action('loadAllGroups groups', (groups) => {
        const groupData = groups.result;
        this.setAllGroups(groupData);
        console.log('loadAllGroups groups', groups);
        console.log('loadAllGroups groupData', groupData);
        console.log('loadAllGroups this.allGroups', this.allGroups);
      }))
      .catch(action('loadAllGroups error', (err) => {
        this.loadingGroups = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('loadAllGroups finally', () => {
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
      .then(action('loadUsersGroups then', (groups) => {
        console.log('groups in loadUsersGroups', groups);
        const userGroupData = groups.result;
        this.setUserGroups(userGroupData);
      }))
      .catch(action('loadUsersGroups error', (err) => {
        this.loadingGroups = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('loadUsersGroups finally', () => {
        this.loadingGroups = false;
      }));
  }

  @action setAllGroups(groupData){
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

  @action setUserGroups(userGroupData){
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
      if (this.currentGroup.userId === '' || this.currentGroup.userId === undefined){
        this.currentGroup.userId = userStore.currentUser.userId;
      }
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
      .then(action('saveNewGroup then', (data) => {
        console.log('saving group', data);
        this.addGroupToUserSet(this.usersGroups, data.result);
        if (userStore.isSuperAdmin){
          this.addGroupToUserSet(this.allGroups, data.result);
        }
      }))
      .catch(action('saveNewGroup error', (err) => {
        this.isSavingGroup = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('saveNewGroup finally', () => {
        this.clearNewSaveData();
        this.isSavingGroup = false;
        console.log('post saving group allGroups', this.allGroups.values());
        console.log('post saving group userGroups', this.usersGroups.values());
      }));
  }

  @action addGroupToUserSet(userGroup, groupData){
    console.log('addGroupToUserSet groupData', groupData);
    userGroup.set(
      groupData._id,
      new Group(
        groupData._id,
        groupData.groupName,
        groupData.numGLSlots,
        groupData.department
      ));
    console.log('adding group to set', userGroup);
  }

  @action editGroup(){
    this.isSavingGroup = true;
    return agent.Groups
      .editGroup(this.currentGroup.groupId, this.currentGroup)
      .catch(action('editGroup error', (err) => {
        this.isSavingGroup = false;
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('editGroup finally', () => {
        if (userStore.isUser){
          this.loadUsersGroups()
            .finally(action('editGroup fianlly loadUsersGroups finally', () => {
              this.isSavingGroup = false;
            }));
        }
        else if (userStore.isSuperAdmin){
          this.loadAllGroups()
            .finally(action('editGroup fianlly loadAllGroups finally', () => {
              this.isSavingGroup = false;
            }));
        }
      }));
  }

  @action deleteGroup(){
    this.deletingGroup = true;
    return agent.Groups
      .deleteGroup(this.deleteGroupId)
      .catch(action('deleteGroup error',(err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action('deleteGroup finally',() => {
        this.deletingGroup = false;
        this.allGroups.delete(this.deleteGroupId);
        messagingStore.successfullyDeletedGroup = true;
        this.deleteGroupId = '';
      }));
  }

  @action clearNewSaveData(){
    this.newGroup = {
      groupName: '',
      numGLSlots: 0,
      userId: ''
    };
  }

  @action clearCurrentGroup(){
    this.currentGroup = {};
  }

}

export default new GroupStore();