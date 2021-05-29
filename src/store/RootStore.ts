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
  try {
    let autoUpdate = window.localStorage.getItem("autoUpdate")

    if (autoUpdate) {
        console.log('auto upd', JSON.parse(autoUpdate))
        rootStore.user.setAutoUpdate(JSON.parse(autoUpdate))
        if (JSON.parse(autoUpdate)) {
          rootStore.user.setAutoUpdateObserver()
        }
    }
  } catch (e) {
    console.log(e)
  }
}

autorun(
  async () => {
    if (rootStore.user.autoUpdate) {
        rootStore.user.setAutoUpdate(rootStore.user.autoUpdate)
        if (rootStore.user.autoUpdate) {
          rootStore.user.setAutoUpdateObserver()
        }
    }
  },
  { scheduler: run => { setInterval(run, 30000) }}
)

export default rootStore;
export { RootStore }