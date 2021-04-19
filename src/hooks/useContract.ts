import { useMemo } from 'react';
import useWeb3 from '@src/hooks/useWeb3';
import {
    getDonateContract,
    getBep20Contract
} from '@src/utils/contractHelpers'

export const useDonate = () => {
    const web3 = useWeb3()
    return useMemo(() => getDonateContract(web3), [web3])
}

export const useERC20 = (address: string) => {
    const web3 = useWeb3()
    return useMemo(() => getBep20Contract(address, web3), [address, web3])
}