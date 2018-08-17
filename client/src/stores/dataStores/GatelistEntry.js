import { observable } from 'mobx';

export class GatelistEntry {
  @observable gatelistId = "";
  @observable firstName = "";
  @observable lastName = 0;
  @observable date = "";
  @observable minor = "";
  @observable notes = "";
  @observable groupId = 0;
  @observable createdDate = "";
  @observable addedBy = "";

  constructor(gatelistId, firstName, lastName, date, minor, notes, groupId, createdDate, addedBy) {
    this.gatelistId = gatelistId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.date = date;
    this.minor = minor;
    this.notes = notes;
    this.groupId = groupId;
    this.createdDate = createdDate;
    this.addedBy = addedBy;
  }
}