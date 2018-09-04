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

  // @observable usersGroups = observable.map();
  // @observable allGroups = observable.map();

  @observable usersGroups = {hash: {}, list: []};

  @observable allGroups = {hash: {}, list: []};

  @observable newGroup = {
    groupName: '',
    numGLSlots: 0,
    userId: ''
  };

  @observable loadingGroups = false;

  @observable errors;

  @observable deleteGroupId = '';

  @computed get getNumUserGroups(){
    return this.usersGroups.list.length;
  }

  @computed get getUserGroups(){
    return this.usersGroups.list;
  }

  @computed get getNumAllGroups() {
    return this.allGroups.list.length;
  }

  @computed get getAllGroups(){
    return this.allGroups.list;
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
    else if (userStore.isSuperAdmin && this.allGroups.hash[groupId] !== undefined){
      this.currentGroup = this.allGroups.hash[groupId];
    }
    else if (userStore.isUser && this.usersGroups.hash[groupId] !== undefined){
      this.currentGroup = this.usersGroups.hash[groupId];
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
    // this.allGroups.clear();
    this.clearAllGroups();
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
    // this.usersGroups.clear();
    this.clearUsersGroups();
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
    // this.allGroups.clear();
    this.clearAllGroups();
    groupData.forEach((group) => {

      if (this.allGroups.hash[group._id] === undefined){

        const groupObj = new Group(
          group._id,
          group.groupName,
          group.numGLSlots,
          group.department
        );

        this.allGroups.hash[group._id] = groupObj;
        this.allGroups.list.push(groupObj);
      }

      // this.allGroups.set(
      //   group._id,
      //   new Group(
      //     group._id,
      //     group.groupName,
      //     group.numGLSlots,
      //     group.department
      //   ));
    });
  }

  @action setUserGroups(userGroupData){
    // this.usersGroups.clear();
    this.clearUsersGroups();
    userGroupData.forEach((group) => {

      if (this.usersGroups.hash[group._id] === undefined){

        const groupObj = new Group(
          group._id,
          group.groupName,
          group.numGLSlots,
          group.department
        );

        this.usersGroups.hash[group._id] = groupObj;
        this.usersGroups.list.push(groupObj);
      }

      // this.usersGroups.set(
      //   group._id,
      //   new Group(
      //     group._id,
      //     group.groupName,
      //     group.numGLSlots,
      //     group.department
      //   ));
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
        console.log('post saving group allGroups', values(this.allGroups));
        console.log('post saving group userGroups', values(this.usersGroups));
      }));
  }

  @action addGroupToUserSet(userGroup, groupData){
    console.log('addGroupToUserSet groupData', groupData);

    const group = new Group(
      groupData._id,
      groupData.groupName,
      groupData.numGLSlots,
      groupData.department
    );

    if (userGroup.hash[groupData._id] === undefined){
      userGroup.hash[groupData._id] = group;
      userGroup.list.push(group);
    }
    else {
      const newList = userGroup.list.filter((filterGroup) => {
        return filterGroup.groupId !== groupData._id;
      });
      userGroup.hash[groupData._id] = group;
      userGroup.list = newList;
    }

    // userGroup.set(
    //   groupData._id,
    //   new Group(
    //     groupData._id,
    //     groupData.groupName,
    //     groupData.numGLSlots,
    //     groupData.department
    //   ));
    console.log('adding group to set', userGroup);
    return userGroup;
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
        // this.allGroups.delete(this.deleteGroupId);
        this.removeFromGroupList(this.allGroups, this.deleteGroupId);
        messagingStore.successfullyDeletedGroup = true;
        this.deleteGroupId = '';
      }));
  }

  @action removeFromGroupList(groupList, groupId){
    delete groupList.hash[groupId];
    const filtered = groupList.list.filter((group) => {
      return group.groupId !== groupId;
    });
    groupList.list = filtered;
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

  @action clearUsersGroups(){
    this.usersGroups = {hash: {}, list: []};
  }

  @action clearAllGroups(){
    this.allGroups = {hash: {}, list: []};
  }

}

export default new GroupStore();