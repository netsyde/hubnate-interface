import { makeObservable, observable, action, computed } from "mobx";
import { RootStore } from './RootStore';

class UserStore {
    isConnected: boolean = false;
 
	constructor(public root: RootStore) {
        makeObservable(this, {
            isConnected: observable,
            connectAccount: action,
        })
	}
 
    connectAccount() {
        this.isConnected = true
    }
}
 
 
 
export { UserStore };