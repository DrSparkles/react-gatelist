import { observable } from 'mobx';

class MessagingStore {

  @observable successfullyDeletedUser = false;

  @observable successfullyAddedGatelist = false;

}

export default new MessagingStore();