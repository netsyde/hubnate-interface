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
import { approve } from '@src/utils/callHelpers';
import Skeleton from 'react-loading-skeleton';
import poolsGap from '@src/data/constants/pools'
import Link from 'next/link';
import { ethers } from 'ethers'
import { fixNumber } from '@src/utils';
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

interface IStatsBubble {
    name: string,
    number: number,
    width?: number
}

const StatsBubble = (props: IStatsBubble) => {
    return (
        <div className="statsBubble" style={{width: props.width}}>
            <p className="statsBubble_name">{props.name || <Skeleton />}</p>
            <p className="statsBubble_number">{typeof(props.number) == 'number' ? props.number : <Skeleton />}</p>
        </div>
    )
}

const BigStatsBubble = (props: IStatsBubble) => {
    return (
        <div className="statsBubble statsBubble-big" style={{width: props.width}}>
            <p className="statsBubble_name">{props.name || <Skeleton />}</p>
            <p className="statsBubble_number-big">{typeof(props.number) == 'number' ? props.number : <Skeleton />}</p>
        </div>
    )
}

interface IStatsItem {
    title: string,
    value: number
}

const StatsItem = (props: IStatsItem) => {
    return (
        <div className="pools_panel__content_stats__item">
            <p className="pools_panel__content_stats__item_title">
                {props.title || <Skeleton />} 
            </p>
            <p className="pools_panel__content_stats__item_value">
                {props.value || <Skeleton />}
            </p>
        </div>
    )
}

interface ISelector {
    poolList: IPool[],
    selected: number,
    setSelected: any
}

const Selector = (props: ISelector) => {
    const [expanded, setExpanded] = useState<boolean>(false)
    const [balances, setBalances] = useState<number[]>([])
    const { account } = useWeb3React()

    const onClickInput = async () => {
        setExpanded(!expanded)
    }

    const onClickItem = (index: number) => {
        props.setSelected(index)
        setExpanded(false)
    }
    let tokens = props.poolList.map((pool, index) => useERC20(props.poolList[index].token.address[4]))
    

    useEffect(() => {
        const getUserTokenBalances = async () => {
            if (!account) return;
            let balances = []
            for (let i = 0; i < props.poolList.length; i++) {
                let token = tokens[i]
                let response = await token.methods.balanceOf(account).call()

                if (response) {
                    balances.push(fixNumber(response, 18))
                }
                console.log('currentBalance', fixNumber(response, 18))
            }
            setBalances(balances)           
        }

        getUserTokenBalances()
    }, [account])

    return (
        <div className="pools_panel__content_input_container">
            <div className="pools_panel__content_input pools_panel__content_input-selector" onClick = {onClickInput}>
                <div className="pools_panel__content_input__selector">
                    <img src={props.poolList[props.selected].token.logotype} alt="" />
                    <p>{props.poolList[props.selected].token.name}</p>
                </div>
                <img className="pools_panel__content_input__chevron" src={chevron} alt="chevron-right" />
            </div>

            {expanded &&
                <div className="pools_panel__content_input__expanded">
                    {props.poolList.map((pool, index) =>
                        <div key = {index} className="pools_panel__content_input__expanded_item" onClick = {() => onClickItem(index)}>
                            <div className="pools_panel__content_input__expanded_item__token">
                                <img src={pool.token.logotype} alt={pool.token.name} />
                                <p>{pool.token.name}</p>
                            </div>
                            
                            <p className="pools_panel__content_input__expanded_item__balance">{balances[index]}</p>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

interface IButtonState {
    type: 'default' | 'disabled';
    text: 'Enable' | 'Donate' | 'Confirming...' | 'Insufficient balance' | 'Enter number' | 'Connect'
}

const Pools = inject("rootStore")(observer((props: IPools) => {
    let [selectedPool, setSelectedPool] = useState<number>(0);
    const size = useWindowSize();
    const [poolList, setPoolList] = useState<IPool[]>(poolsGap)
    const { account } = useWeb3React()
    const { login } = useAuth()
    const hubnateContract = useHubnate()
    const CTcontracts = poolList.map((pool) => useCT(pool.CT[4]))
    const [amount, setAmount] = useState<number>(1);
    const [cost, setCost] = useState<number>(0);
    const [chance, setChance] = useState<number>(0);
    const [buttonState, setButtonState] = useState<IButtonState>(
        {
            type: 'disabled',
            text: 'Insufficient balance'
        }
    )
    const [allowance, setAllowance] = useState<boolean>(true);
    const [wait, setWait] = useState<boolean>(false)
    const [userBalance, setUserBalance] = useState<number>(0)
    const [blinkTag, setBlinkTag] = useState<boolean>(false);
    let token = useERC20(poolList[selectedPool].token.address[4])

    const onClickEnable = async () => {
        setWait(true)
        let approveTx = await approve(token, hubnateContract, account, ethers.constants.MaxUint256)
        if (approveTx) {
            setAllowance(true)
            setWait(false)
        }
        console.log(approveTx)
    }

    const onClickDonate = async () => {
        let poolId = poolList[selectedPool].id;
        setWait(true)   
        let donate = await hubnateContract.methods.donate(124, poolId, amount).send({ from: account })
        
        if (donate) {
            console.log(donate)
            setWait(false)
        }
    }

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

    useEffect(() => {
        const getSended = async () => {
            let userSended = await props.rootStore.user.getUserUnclaimDonates(hubnateContract, poolList[selectedPool].id, account)
            if (userSended && userSended.length > 0) {
                setBlinkTag(true)
            }
        }
        getSended()
    }, [account, selectedPool])

    useEffect(() => {
        const getUserTokenBalance = async () => {
            if (!account) return;

            let response = await token.methods.balanceOf(account).call()
            // const currentBalance = new BigNumber(response)
            console.log('currentBalance', fixNumber(response, 18))

            if (response) {
                setUserBalance(fixNumber(response, 18))
            }
        }

        getUserTokenBalance()
    }, [account, token])

    useEffect(() => {
        const getTicketCost = async () => {
            let pool = poolList[selectedPool].costPerTicket ? poolList[selectedPool] : false
            let fixAmount = amount ? amount : 0;
            if (pool) {
                let costToBuyTickets = pool.costPerTicket * Number(fixAmount);
                setCost(costToBuyTickets)
            }
        }

        const getChance = async () => {
            let pool =  poolList[selectedPool]
            let fixAmount = amount ? Number(amount) : 0
            if (pool) {
                console.log(fixAmount, pool.userDonated, pool.totalDonated, pool.totalDonated + fixAmount)
                let chance = Number(( ( (fixAmount + pool.userCThodlAmount) * pool.costPerTicket / (pool.totalDonated + (fixAmount * pool.costPerTicket)) ) * 100).toFixed(2))

                if (chance > 100) {
                    setChance(100)
                } else {
                    setChance(chance)
                }
                
            }
            
        }

        getTicketCost()
        getChance()
    }, [amount, selectedPool, account, poolList, token]);

    let [onPresentConnectModal] = useModal(
        <ConnectModal 
            login = {login}
        />
    )

    const onClickButton = (index: number) => {
        switch (buttonState.text) {
            case 'Connect':
                onPresentConnectModal()
                console.log('connect action')
                break;
            case 'Enable':
                onClickEnable()
                console.log('enabling action')
                break;
            case 'Donate':
                onClickDonate()
                console.log('donate action')
                break;
        }
    }

    const onClickSettings = () => {
        alert('not implemented')
    }

    useEffect(() => {
        if (!account) {
            setButtonState({
                type: 'default',
                text: 'Connect'
            })
            return;
        }

        if (Number(amount) == 0) {
            setButtonState({
                type: 'disabled',
                text: 'Enter number'
            })
            return;
        }

        if (userBalance >= amount) {
            console.log(Number(amount) == 0)
        
            if (allowance) {
                if (!wait) {
                    setButtonState({
                        type: 'default',
                        text: 'Donate'
                    })
                } else {
                    setButtonState({
                        type: 'disabled',
                        text: 'Confirming...'
                    })
                }
            } else {
                setButtonState({
                    type: 'default',
                    text: 'Enable'
                })
            }
        } else {
            setButtonState({
                type: 'disabled',
                text: 'Insufficient balance'
            })
        }
    }, [amount, account, selectedPool, token, wait, allowance])

    const onChangeAmount = (e: any) => {
        setAmount(e.target.value.replace(/^0|\D/g, ''))
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
                    >
                        <div className="pools">
                            <div className="pools_info">
                                <div className="pools_info__menu">
                                    <Link href={"/pools"}>
                                        <a>
                                            <p className="pools_info__menu-enabled">Information</p>
                                        </a>
                                    </Link>
                                    <Link href={"/pools/claim"}>
                                        <div className="pools_info__menu_upg">
                                            <a>
                                                <p>Claim</p>
                                            </a>
                                            {blinkTag && <div className="pools_info__menu_tag" />}
                                        </div>
                                    </Link>
                                    <Link href={"/pools/history"}>
                                        <a>
                                            <p>History</p>
                                        </a>
                                    </Link>
                                </div>
                                {<p className="pools_info__description">
                                    {poolList[selectedPool].token.description}
                                </p>  || <Skeleton />}
                                <div className="pools_info__stats">
                                    <div className="pools_info__stats_row">
                                        <StatsBubble name = {"Distributed"} number = {poolList[selectedPool].totalDonated}/>
                                        <StatsBubble name = {"Cost per Ticket"} number = {poolList[selectedPool].costPerTicket}/>
                                        <StatsBubble name = {"HODL CT Value"} number = {poolList[selectedPool].userCThodlAmount}/>
                                    </div>
                                    <div className="pools_info__stats_row">
                                        <div className="pools_info__stats_row-left">
                                            <BigStatsBubble name = {"Chance, %"} number = {poolList[selectedPool].chance}/> {/* 362 = (single block + padding + margin-right + border) * 2 */}
                                        </div>
                                        <div className="pools_info__stats_row-right">
                                            <StatsBubble name = {"Donated (your)"} number = {poolList[selectedPool].userDonated}/>
                                            <StatsBubble name = {"Recieved (your)"} number = {poolList[selectedPool].userRecieved}/>
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
                                <form className="pools_panel__content">
                                    <h2>Pool</h2>
                                    <Selector 
                                        poolList = {poolList}
                                        selected = {selectedPool}
                                        setSelected = {setSelectedPool}
                                    />
                                    <div className="pools_panel__content_input__title">
                                        <h2>Amount</h2>
                                        <p>Balance: {userBalance}</p>
                                    </div>
                                    <input 
                                        required
                                        min = {1}
                                        max = {userBalance}
                                        value = {amount}
                                        onChange = {onChangeAmount}
                                        pattern = "^[0-9]*$"
                                        type="number"
                                        placeholder = "1"
                                        className="pools_panel__content_input"
                                    />
                                    <div className="pools_panel__content_button">
                                        <Button 
                                            name = {buttonState.text}
                                            type = {buttonState.type}
                                            padding = "10px 100px"
                                            onClick = {onClickButton}
                                        />
                                    </div>
                                    <div className="pools_panel__content_stats">
                                        <StatsItem title={"New chance"} value={chance}/>
                                        <StatsItem title={"Cost to buy tickets"} value={cost}/>
                                        {/* <StatsItem title={"Estimated Fee"} value={0.001}/> */}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Container>
                </div>
            </Main>
        </>
    )
}))

export default Pools;
