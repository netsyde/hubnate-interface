interface IPool {
    name: string,
    description?: string,
    logotype: any,
    totalDonated: number,
    chance: number,
    yourDeposit: number,
    donaters: number,
    active: boolean,
}

export default IPool;