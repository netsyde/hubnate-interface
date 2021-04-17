import { useMemo } from 'react';
import useWeb3 from '@src/hooks/useWeb3';
import {
    getDonateContract
} from '@src/utils/contractHelpers'

export const useDonate = () => {
    const web3 = useWeb3()
    return useMemo(() => getDonateContract(web3), [web3])
}
