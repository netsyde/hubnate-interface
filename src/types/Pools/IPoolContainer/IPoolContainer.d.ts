import { IPool } from '@types/Pools'

interface IPoolContainer {
    pools: IPool[]
    openDonateModal: boolean | 'initial'
    setOpenDonateModal: any
    setSelectedPool: any
}

export default IPoolContainer;