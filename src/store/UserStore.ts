import { makeObservable, observable, action, computed,  } from "mobx";
import { RootStore } from './RootStore';
import poolList from '@src/data/constants/pools';
import { IPool } from '@src/types/Pools'
import { forEach } from "lodash";

interface IFetchPool {
    poolId: number,
    token: string,
    ticketToken: string,
    costPerTicket: number,
    donateIdCounter: number,
    totalTickets: number
}

interface IFetchUserInPool {
    totalDonated: number,
    totalRecieved: number,
    donated: number[],
    recieved: number[]
}

class UserStore {
    isConnected: boolean = false;
    selectedPool: number = 0;
	constructor(public root: RootStore) {
        makeObservable(this, {
            isConnected: observable,
            connectAccount: action,
            fetchPool: action,
            selectedPool: observable
        })
	}
 
    connectAccount() {
        this.isConnected = true
    }

    setSelectedPool(pool: number) {
        this.selectedPool = pool
    }

    fixNumber(number: number, decimals: number) {
        return Number((number / Math.pow(10, decimals)).toFixed(0))
    }
    
    async fetchPool (donateContract: any, poolId: number) {
        try {   
            let pool = await donateContract.methods.getBasicPoolInfo(poolId).call()
            return pool
        } catch (e) {
            // console.log(e)
            return false
        }
    }

    async fetchUserInPool (donateContract: any, poolId: number, account: string) {
        try {   
            let userInPool = await donateContract.methods.getUserInfo(poolId, account).call()
            return userInPool
        } catch (e) {
            // console.log(e)
            return false
        }
    }

    async getUserCTAmount (CTcontract: any, account: string) {
        try {
            let userCTInfo = await CTcontract.methods.getUserTokensInfo(account).call()
            return userCTInfo.length
        } catch (e) {
            // console.log(e)
            return false;
        }
    }

    async getUserRecieved (donateContract: any, poolId: number,  account: string) {
        try {
            let user: IFetchUserInPool = await this.fetchUserInPool(donateContract, poolId, account)
            let recieved = []
            for (let i = 0; i < user.recieved.length; i++) {
                let donate = user.recieved[i]
                let donateInfo = await donateContract.methods.getBasicDonateInfo(poolId, donate).call()
                recieved.push(donateInfo);
            }
            return recieved

        } catch (e) {
            // console.log(e)
            return false;
        }
    }

    async getUserSended (donateContract: any, poolId: number,  account: string) {
        try {
            let user: IFetchUserInPool = await this.fetchUserInPool(donateContract, poolId, account)
            let donated = []
            for (let i = 0; i < user.donated.length; i++) {
                let donate = user.donated[i]
                let donateInfo = await donateContract.methods.getBasicDonateInfo(poolId, donate).call()
                donated.push(donateInfo);
            }
            return donated

        } catch (e) {
            // console.log(e)
            return false;
        }
    }

    async getUserUnclaimDonates (hubnateContract: any, poolId: number, account: string) {
        try {
            let userSended = await this.getUserSended(hubnateContract, poolId, account)
            
            if (userSended) {
                return userSended.filter(donate => !donate.isTicketsClaim && donate.isDistribution)
            } else {
                return false;
            }
        } catch (e) {
            // console.log(e)
            return false;
        }
    }

    async getPoolData (donateContract: any, CTcontract: any, poolId: number, account: string) {
        try {
            let pool: IFetchPool = await this.fetchPool(donateContract, poolId);
            let userInPool: IFetchUserInPool = await this.fetchUserInPool(donateContract, poolId, account)
            let poolInfo: IPool = poolList.find((pool) => pool.id == poolId)
            let ctUserAmount: number = await this.getUserCTAmount(CTcontract, account)
            if (pool) {
                let decimals = 18
                poolInfo.costPerTicket = Number(this.fixNumber(pool.costPerTicket, decimals));
                poolInfo.totalDonated =  Number(this.fixNumber(pool.costPerTicket * pool.totalTickets, decimals));
                // poolInfo.allowance = allowance;
                
                if (userInPool) {
                    poolInfo.userDonated = Number(this.fixNumber(userInPool.totalDonated, decimals));
                    poolInfo.userRecieved = Number(this.fixNumber(userInPool.totalRecieved, decimals));
                    // console.log(poolInfo.userDonated, poolInfo.userRecieved )
                    poolInfo.userDonatedIds = userInPool.donated;
                    poolInfo.userRecievedIds = userInPool.recieved;
                    // console.log(poolInfo.userDonatedIds, poolInfo.userRecievedIds )
                }

                if (typeof(ctUserAmount) == 'number') {
                    poolInfo.chance = Number( (ctUserAmount * poolInfo.costPerTicket / poolInfo.totalDonated * 100).toFixed(2));
                    poolInfo.userCThodlAmount = Number(ctUserAmount);
                }

                return poolInfo
            } else {
                return false
            }

        } catch (e) {
            // console.log(e)
            return false;
        }
    }

    async getPools(donateContract: any, CTcontracts: any, account: string) {
        try {
            let pools: IPool[] = [];

            for (let i = 0; i < poolList.length; i++) {
                let poolId = poolList[i].id

                let poolInfo = await  this.getPoolData(donateContract, CTcontracts[i], poolId, account)
                
                if (poolInfo) {
                    pools.push(poolInfo)
                } else {
                    // return false;
                }
            }
            return pools;
        } catch (e) {
            // console.log(e)
            return false
        }

    }
}
 
 
 
export { UserStore };