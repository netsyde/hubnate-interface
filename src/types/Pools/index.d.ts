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
    id: number,
    token: IToken,
    active: boolean,
    // fetch from blockchain
    costPerTicket?: number,
    totalDonated?: number,
    chance?: number,
    userDonated?: number,
    userRecieved?: number,
}

export interface IToken {
    logotype: any,
    name: string,
    address: any,
    decimals: number,
    description?: string
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
