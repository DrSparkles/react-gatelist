import { observable, action, computed, values } from 'mobx';
import agent from '../agent';
import Group from './dataStores/Group';
import settingStore from './settingStore';


class GroupStore {

  @observable currentGroup = {
    groupId: 0,
    groupName: '',
    numGLSlots: 0,
    userId: ''
  };

  @observable usersGroups = observable.map();

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
  @action loadUsersGroups() {
    this.loadingGroups = true;
    return agent.Groups
      .getUsersGroups()
      .then(action((groups) => {
        console.log('groups in loadUsersGroups', groups);
        this.usersGroups.clear();
        const userGroupData = groups.result;
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
      }))
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.message;
        throw err;
      }))
      .finally(action(() => {
        this.loadingGroups = false;
      }));
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