import { observable } from 'mobx';


/**
 * Store for handling user auth
 */
class InterfaceStore {

  @observable workingWithWeek = '';

  @observable adminTabIndex = 0;

}

export default new InterfaceStore();