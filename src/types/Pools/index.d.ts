export interface IUserInPool {
    poolName: string,
    logotype: any,
    total: number,
    chances: IPercent[],
    mainPoolColor: string,
    secondaryPoolColor: string,
    lineColor: string
}

export interface IPercent {
    time: string,
    value: number
}

export interface IPool {
    name: string,
    description?: string,
    logotype: any,
    totalDonated: number,
    chance: number,
    yourDeposit: number,
    donaters: number,
    active: boolean,
}

export interface IPoolContainer {
    pools: IPool[]
    openDonateModal: boolean | 'initial'
    setOpenDonateModal: any
    setSelectedPool: any
}

export interface IPoolSelector {
    pools: IUserInPool[],
    selectedPool: number,
    setSelectedPool: any
}
