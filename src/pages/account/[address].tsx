import { Main } from '@src/layouts'
import { Container } from '@components/Utility'
import { Button, Chart } from '@components/Utility'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { IChartApi } from 'lightweight-charts'
// import poolList from '@src/data/userInPools'
import { PoolSelector } from '@components/Account';
import Head from 'next/head'
import { useWindowSize, convertNumber, minifyString } from '@src/utils';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';
import poolsGap from '@src/data/constants/pools';
import { IPool } from '@src/types/Pools';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract';
let baran = require('@src/images/ui/baran.gif')

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IAccount {
    data: any,
    rootStore: RootStore
}

const Account = inject("rootStore")(observer((props: IAccount) => {
    const address = props.data.address;
    const [selectedPool, setSelectedPool] = useState<number>(0);
    const [chart, setChart] = useState<IChartApi>(null);
    const size = useWindowSize();
    const [poolList, setPoolList] = useState<IPool[]>(poolsGap)
    const donateContract = useHubnate()
    const CTcontracts = poolList.map((pool) => useCT(pool.CT[4]))

    useEffect(() => {
        const getPoolList = async () => {
            let fetchPoolList =  await props.rootStore.user.getPools(donateContract, CTcontracts, address) || poolsGap;
            console.log(fetchPoolList)
            if (fetchPoolList) {
                setPoolList(fetchPoolList)
            }
        }
        
        getPoolList()
    }, [selectedPool, address]);

    if (address) {
        return (
            <>
                <Head>
                    <title>Hubnate | Account</title>
                </Head>
                <Main>
                    <div className = "account">
                        <Container
                            className = {"account_container"}
                            title = {"Account"}
                            address = {isMobile(size.width) ? minifyString(address) : address}
                        >
                            <div className = "account_main">
                                <div className = "account_main__info">
                                    <PoolSelector 
                                        pools = {poolList}
                                        selectedPool = {selectedPool}
                                        setSelectedPool = {setSelectedPool}
                                    />
                                    <p className = {"account_text"}>Chance: {poolList[selectedPool].chance}% ({poolList[selectedPool].userCThodlAmount} tickets)</p>
                                    <p className = {"account_text"}>Total donated: {poolList[selectedPool].totalDonated}</p>
                                </div>
                                <div className = "account_main__buttons">
                                    <Button 
                                        name = "Sended"
                                        link = {`/account/${address}/sended`}
                                        type = {'default'}
                                        padding = "10px 20px"
                                        className = {"mr10"}
                                        
                                    />
                                    <Button 
                                        name = "Recieved"
                                        link = {`/account/${address}/recieved`}
                                        type = {'default'}
                                        padding = "10px 20px"
                                    />
                                </div>
                            </div>
                            {/* <Chart
                                chart = {chart}
                                setChart = {setChart}
                                data = {}
                                selectedPool = {selectedPool}
                                isMobile = {isMobile(size.width)}
                            /> */}
                        </Container>
                    </div>
                </Main>
            </>
        )
    } else {
        return null
    }
}))

export const getServerSideProps = async (contex: any) => {
    const data = {
        address: contex.query.address
    }
    return { props: { data } }
}

export default Account;