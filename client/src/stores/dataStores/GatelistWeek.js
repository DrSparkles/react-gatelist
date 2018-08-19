import { observable } from 'mobx';

export class GatelistWeek {
  @observable gatelistWeek = observable.map();

  constructor() {

  }

  addGatelistEntry(week, gatelistEntry){
    let weekList = this.gatelistWeek.get(week);
    if (weekList === undefined){
      weekList = observable.map();
    }

    weekList.set(gatelistEntry.gatelistId, gatelistEntry);
    this.gatelistWeek.set(week, weekList);

  }

  getGatelistWeek(week){
    return this.gatelistWeek.get(week);
  }

  getGatelistWeekValues(){
    return this.gatelistWeek.values();
  }
}