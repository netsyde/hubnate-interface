import React, { useState, useEffect } from "react";
import { Main } from '@src/layouts';
import { Container } from '@components/Utility';
import DonateModal from '@components/DonateModal';
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
import Skeleton from 'react-loading-skeleton';
import poolsGap from '@src/data/constants/pools'
const chevron = require('@images/ui/chevron-right.svg')

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IExpandedRow {
    index: number,
    poolList: IPool[],
    onClick: any,
    openDonateModal?: any
}

interface IPools {
    rootStore?: RootStore
}

const metaNumber = (number: number) => {
    try {
        return typeof(number) == 'number' && `${convertNumber(number)}` || <Skeleton/>
    } catch (e) {
        return <Skeleton/>
    }
}

const metaAccountNumber = (number: number, account: string) => {
    try {
        return typeof(number) == 'number' && (account ? `${convertNumber(number)}` : `locked`) || <Skeleton/>
    } catch (e) {
        return <Skeleton/>
    }
}

interface IStatsBubble {
    name: string,
    number: number,
    width?: number
}

const StatsBubble = (props: IStatsBubble) => {
    return (
        <div className="statsBubble" style={{width: props.width}}>
            <p className="statsBubble_name">{props.name}</p>
            <p className="statsBubble_number">{props.number}</p>
        </div>
    )
}

const BigStatsBubble = (props: IStatsBubble) => {
    return (
        <div className="statsBubble statsBubble-big" style={{width: props.width}}>
            <p className="statsBubble_name">{props.name}</p>
            <p className="statsBubble_number-big">{props.number}%</p>
        </div>
    )
}

const Pools = inject("rootStore")(observer((props: IPools) => {
    // let [selectedPool, setSelectedPool] = useState<number>(0);
    const size = useWindowSize();
    const [poolList, setPoolList] = useState<IPool[]>(poolsGap)
    const [chevrons, setChevrons] = useState<boolean[]>(poolList ? poolList.map(() => false) : [false])
    const { account } = useWeb3React()
    const { login } = useAuth()
    const donateContract = useHubnate()
    const CTcontracts = poolList.map((pool) => useCT(pool.CT[4]))
    
    useEffect(() => {
        const getPoolList = async () => {
            let fetchPoolList =  await props.rootStore.user.getPools(donateContract, CTcontracts, account) || poolsGap;
            console.log(fetchPoolList)
            if (fetchPoolList) {
                setPoolList(fetchPoolList)
            }
        }
        
        // getPoolList()
    }, [account]);

    let [onPresentDonateModal] = useModal(
        <DonateModal 
            pools = {poolList ? poolList : false} // poolList.filter((pool) => pool.active)
        />
    )

    let [onPresentConnectModal] = useModal(
        <ConnectModal 
            login = {login}
        />
    )

    const onClickDonate = (index: number) => {
        // console.log('first donate', index, selectedPool)
        props.rootStore.user.setSelectedPool(index)
        onPresentDonateModal() // TODO: fix updating selectedPool ^
    }

    const onClickSettings = () => {
        alert('not implemented')
    }


    return (
        <>
            <Head>
                <title>Hubnate | Pools</title>
            </Head>
            <Main
            >
                <div className = "pools_container">
                    <Container 
                        title = {"Pools"}
                        address = {''}
                        // onClickElement = {() => onClickSettings()}
                    >
                        <div className="pools">
                            <div className="pools_info">
                                <div className="pools_info__menu">
                                    <p className="pools_info__menu-enabled">Information</p>
                                    <p>Claim</p>
                                    <p>History</p>
                                </div>
                                <p className="pools_info__description">
                                    The BUX Token (BUX) is a Binance Smart Chain powered BEP20 utility token that can be used
                                    on the BUX Crypto platform to trade with 0% commission and access premium features. 
                                    In the near future, BUX aims to enrich a range of community features so that the token offers
                                    tangible advantages on the BUX Crypto platform. The goal is to create a strong use case
                                    for BUX and power a micro-economy within the platform.
                                </p>
                                <div className="pools_info__stats">
                                    <div className="pools_info__stats_row">
                                        <StatsBubble name = {"Distributed"} number = {1000}/>
                                        <StatsBubble name = {"Cost per Ticket"} number = {2580}/>
                                        <StatsBubble name = {"HODL CT Value"} number = {10}/>
                                    </div>
                                    <div className="pools_info__stats_row">
                                        <div className="pools_info__stats_row-left">
                                            <BigStatsBubble name = {"Chance"} number = {22.58}/> {/* 362 = (single block + padding + margin-right + border) * 2 */}
                                        </div>
                                        <div className="pools_info__stats_row-right">
                                            <StatsBubble name = {"Cost per Ticket"} number = {2580}/>
                                            <StatsBubble name = {"HODL CT Value"} number = {10}/>
                                        </div>
                                    </div>

                                </div>
                                
                            </div>
                            <div className="pools_panel">
                                <div className="pools_panel__menu">
                                    <div className="pools_panel__menu_route">
                                        <p className="pools_panel__menu_route-enabled">Donate</p>
                                        <p>Exchange</p>
                                    </div>
                                    <div className="pools_panel__menu_control">
                                        <div className="pools_panel__menu_control__box">

                                        </div>
                                        <div className="pools_panel__menu_control__box">
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="pools_panel__content">
                                    <h2>Pool</h2>
                                    <div className="pools_panel__content_input">
                                        <div className="pools_panel__content_input__selector">
                                            <img src={poolList[1].token.logotype} alt="" />
                                            <p>BUX</p>
                                        </div>
                                        <img className="pools_panel__content_input__chevron" src={chevron} alt="chevron-right" />
                                    </div>
                                    <div className="pools_panel__content_input__warning">Warning message</div>
                                    <div className="pools_panel__content_input__title">
                                        <h2>Amount</h2>
                                        <p>Balance: 1000</p>
                                    </div>
                                    <input className="pools_panel__content_input" />
                                    <div className="pools_panel__content_input__warning">Warning message</div>

                                    <Button 
                                        name = {`Donate`}
                                        link = {`#`}
                                        type = {'default'}
                                        padding = "10px 100px"
                                        onClick = {onClickDonate}
                                    />
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </Main>
        </>
    )
}))

export default Pools;
