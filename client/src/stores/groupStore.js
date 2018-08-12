import { observable, action } from 'mobx';
import agent from '../agent';
import Group from './dataStores/Group';

class GroupStore {

  @observable currentGroup;

  @observable usersGroups = observable.map();

  @observable loadingGroups = false;

  @observable errors;

  /**
   * @returns {Promise<any>}
   */
  @action loadUsersGroups() {
    this.loadingGroups = true;
    return agent.Groups
      .getUsersGroups()
      .then(action((groups) => {
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

}

export default new GroupStore();