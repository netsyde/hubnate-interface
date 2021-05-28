import { UserStore } from './UserStore';
import { autorun } from "mobx";

class RootStore {
  public user: UserStore;
	
  constructor() {
    this.user = new UserStore(this);
  }
}

let rootStore = new RootStore()

const autoSync = async () => {
  let autoUpdate = window.localStorage.getItem("autoUpdate")

  if (autoUpdate) {
      console.log('auto upd', JSON.parse(autoUpdate))
      rootStore.user.setAutoUpdate(JSON.parse(autoUpdate))
      if (JSON.parse(autoUpdate)) {
        rootStore.user.setAutoUpdateObserver()
      }
  }
}

autorun(
  async () => {
    autoSync()
  },
  { delay: 3000 } // TODO: move to client (useEffect)
)

autorun(
  async () => {
    autoSync()
  },
  { scheduler: run => { setInterval(run, 30000) }}
)

export default rootStore;
export { RootStore }