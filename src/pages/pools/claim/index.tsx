import React, { useState, useEffect } from "react";
import { Main } from '@src/layouts';
import { Container } from '@components/Utility';
import { Claim as PoolClaim, Panel } from '@components/Pools';
import ConnectModal from '@components/ConnectModal';
import { IPool } from '@src/types/Pools';
import { Button } from '@components/Utility';
import Head from 'next/head';
import { useWindowSize, convertNumber } from '@src/utils';
import { useModal } from '@src/widgets/Modal';
import { useWeb3React } from '@web3-react/core';
import useAuth from '@src/hooks/useAuth';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import poolsGap from '@src/data/constants/pools'

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IPools {
    rootStore?: RootStore
}

const Claim = inject("rootStore")(observer((props: IPools) => {
    let [selectedPool, setSelectedPool] = useState<number>(0);
    const size = useWindowSize();
    const [poolList, setPoolList] = useState<IPool[]>(poolsGap)
    const { account } = useWeb3React()
    const hubnateContract = useHubnate()
    const CTcontracts = poolList.map((pool) => useCT(pool.CT[4]))    

    useEffect(() => {
        const getPoolList = async () => {
            let fetchPoolList = await props.rootStore.user.getPools(hubnateContract, CTcontracts, account) || poolsGap;
            console.log(fetchPoolList)
            if (fetchPoolList) {
                setPoolList(fetchPoolList)
            }
        }
        
        getPoolList()
    }, [account]);

    return (
        <>
            <Head>
                <title>Hubnate | Pools</title>
            </Head>
            <Main
            >
                <div className = "pools_container">
                    <Container 
                        title = {"Claim"}
                        address = {''}
                    >
                        <div className="pools">
                            <PoolClaim 
                                poolList = {poolList}
                                selectedPool = {selectedPool}
                            />
                            <Panel 
                                poolList = {poolList}
                                selectedPool = {selectedPool}
                                setSelectedPool = {setSelectedPool}
                            />
                        </div>
                    </Container>
                </div>
            </Main>
        </>
    )
}))

export default Claim;
