import { makeObservable, observable, action, computed,  } from "mobx";
import { RootStore } from './RootStore';
import { useDonate, useERC20 } from '@src/hooks/useContract'
import poolList from '@src/data/constants/pools';
import { IPool } from '@src/types/Pools'

interface IFetchPool {
    poolId: number,
    token: string,
    costPerTicket: number,
    donateIdCounter: number,
    totalTickets: number
}

interface IFetchUserInPool {
    totalDonated: number,
    totalRecieved: number
}

class UserStore {
    isConnected: boolean = false;
	constructor(public root: RootStore) {
        makeObservable(this, {
            isConnected: observable,
            connectAccount: action,
            fetchPool: action
        })
	}
 
    connectAccount() {
        this.isConnected = true
    }

    fixNumber(number: number, decimals: number) {
        return Number((number / Math.pow(10, decimals)).toFixed(0))
    }
    
    async fetchPool (donateContract: any, poolId: number) {
        try {   
            let pool = await donateContract.methods.getBasicPoolInfo(poolId).call()
            return pool
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async fetchUserInPool (donateContract: any, poolId: number, account: string) {
        try {   
            let userInPool = await donateContract.methods.getUserInfo(poolId, account).call()
            console.log("u i p", userInPool)
            return userInPool
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async getPoolData (donateContract: any, poolId: number, account: string) {
        try {
            let pool: IFetchPool = await this.fetchPool(donateContract, poolId);
            let userInPool: IFetchUserInPool = await this.fetchUserInPool(donateContract, poolId, account)
            let poolInfo: IPool = poolList.find((pool) => pool.id == poolId)
    
            if (pool) {
                let decimals = 18
                poolInfo.costPerTicket = Number(this.fixNumber(pool.costPerTicket, decimals));
                poolInfo.totalDonated =  Number(this.fixNumber(pool.costPerTicket * pool.totalTickets, decimals));
                // poolInfo.allowance = allowance;

                if (userInPool) {
                    poolInfo.userDonated = Number(this.fixNumber(userInPool.totalDonated, decimals));
                    poolInfo.userRecieved = Number(this.fixNumber(userInPool.totalRecieved, decimals));
                    console.log(poolInfo.userDonated, poolInfo.userRecieved )
                    poolInfo.chance = Number( (poolInfo.userDonated / poolInfo.totalDonated * 100).toFixed(2));
                }

                return poolInfo
            } else {
                return false
            }

        } catch (e) {
            console.log(e)
            return false;
        }
    }

    async getPools(donateContract: any, account: string) {
        try {
            let pools: IPool[] = [];

            for (let i = 0; i < poolList.length; i++) {
                let poolId = poolList[i].id

                let poolInfo = await  this.getPoolData(donateContract, poolId, account)
                
                if (poolInfo) {
                    pools.push(poolInfo)
                } else {
                    // return false;
                }
            }
            return pools;
        } catch (e) {
            console.log(e)
            // return false
        }

    }
}
 
 
 
export { UserStore };