import { UserStore } from './UserStore';
import { autorun } from "mobx";

class RootStore {
  public user: UserStore;
	
  constructor() {
    this.user = new UserStore(this);
  }
}

let rootStore = new RootStore()

autorun(
  async () => {
    if (rootStore.user.autoUpdate) {
        rootStore.user.setAutoUpdateObserver()
    }
  },
  { scheduler: run => { setInterval(run, 30000) }}
)

export default rootStore;
export { RootStore }