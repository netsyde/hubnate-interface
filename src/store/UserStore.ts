import { observable, action, computed } from "mobx";
import { RootStore } from "./RootStore";

class UserStore {
    constructor(public root: RootStore) {
        this.root = root;
      }
}

export { UserStore };