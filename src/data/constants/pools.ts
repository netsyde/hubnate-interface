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
            4: '0x833F526CC197EA52F28b304F83CF488029a8099d'
        }
    },
    {
        id: 2,
        token: tokens.bux,
        active: true,
        CT: {
            56: '',
            97: '',
            4: '0xF78fe05Cd7Cba0648D2FD926d64E94316E43cbec'
        }
    }
]

export default poolList;