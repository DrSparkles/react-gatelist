import { observable } from 'mobx';

export default class Group {
  @observable groupId = "";
  @observable groupName = "";
  @observable numGLSlots = 0;
  @observable department = "";

  constructor(groupId, groupName, numGLSlots = 10, department = 'ent') {
    this.groupId = groupId;
    this.groupName = groupName;
    this.numGLSlots = numGLSlots;
    this.department = department;
  }
}