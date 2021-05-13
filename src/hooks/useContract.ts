import { useMemo } from 'react';
import useWeb3 from '@src/hooks/useWeb3';
import {
    getHubnateContract,
    getBep20Contract,
    getCTContract
} from '@src/utils/contractHelpers'

export const useHubnate = () => {
    const web3 = useWeb3()
    return useMemo(() => getHubnateContract(web3), [web3])
}

export const useERC20 = (address: string) => {
    const web3 = useWeb3()
    return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

export const useCT = (address: string) => {
    const web3 = useWeb3()
    return useMemo(() => getCTContract(address, web3), [address, web3])
}