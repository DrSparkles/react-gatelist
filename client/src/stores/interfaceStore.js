import { observable } from 'mobx';


/**
 * Store for handling user auth
 */
class InterfaceStore {

  @observable workingWithWeek = '';

}

export default new InterfaceStore();