import { observable } from 'mobx';
import Group from './Group';

export default class User {
  @observable userId = "";
  @observable firstName = "";
  @observable lastName = 0;
  @observable email = "";
  @observable userType = "";
  @observable groups = [];

  constructor(userId, firstName, lastName, email, userType, groups = []) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.userType = userType;

    for (let i = 0; i < groups.length; i++){
      const group = groups[i];
      this.groups.push(new Group(group._id, group.groupName, group.numGLSlots));
    }
  }
}