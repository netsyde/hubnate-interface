import React, { useState, useEffect } from "react";
import { Main as MainLayout } from '@src/layouts';
import { Container } from '@components/Utility';
import { Info, Panel } from '@components/Pools';
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

const Main = inject("rootStore")(observer((props: IPools) => {
    const [poolList, setPoolList] = useState<IPool[]>(poolsGap)
    const { account } = useWeb3React()
    const hubnateContract = useHubnate()
    const CTcontracts = poolList.map((pool) => useCT(pool.CT[4]))    

    useEffect(() => {
        try {
            const getPoolList = async () => {
                try {
                    let fetchPoolList = await props.rootStore.user.getPools(hubnateContract, CTcontracts, account);
                    console.log('fetchPoolList-', fetchPoolList)
                    if (fetchPoolList && fetchPoolList.length > 0) {
                        setPoolList(fetchPoolList)
                    }
                } catch (e) {
                    console.log('гнилити кетч')
                    console.log(e)
                }
            }
            
            getPoolList()
        } catch (e) {

            console.log(e)
        }
    }, [account]);

    return (
        <>
            <Head>
                <title>Hubnate | App</title>
            </Head>
            <MainLayout
            >
                <div className = "pools_container">
                    <Container 
                        title = {"App"}
                        address = {''}
                    >
                        <div className="pools">
                            <Info 
                                poolList = {poolList}
                            />
                            <Panel 
                                poolList = {poolList}
                            />
                        </div>
                    </Container>
                </div>
            </MainLayout>
        </>
    )
}))

export default Main;
