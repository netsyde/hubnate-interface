import { UserStore } from './UserStore';

class RootStore {
  public user: UserStore;
	
  constructor() {
    this.user = new UserStore(this);
  }
}

let rootStore = new RootStore()

export default rootStore;
export { RootStore }