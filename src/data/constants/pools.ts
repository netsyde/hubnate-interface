import tokens from './tokens'
import { IPool } from '@src/types/Pools'

const poolList: IPool[] = [
    {
        id: 1,
        token: tokens.nsd,
        active: true,
        CT: {
            56: '',
            97: '',
            4: '0x039b619878c9FF2883153626dA67C090E49F18a1'
        }
    },
    {
        id: 2,
        token: tokens.bux,
        active: true,
        CT: {
            56: '',
            97: '',
            4: '0x4E225c8a056C19079Ea3Ee6a24Ae47C2F249Fd32'
        }
    }
]

export default poolList;