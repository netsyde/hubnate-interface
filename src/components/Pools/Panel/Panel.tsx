import { Selector, StatsItem } from './components';
import { Button } from '@components/Utility';
import React, { useState, useEffect } from "react";
import { IPool } from '@src/types/Pools';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import { ethers } from 'ethers'
import { approve } from '@src/utils/callHelpers';
import { useWeb3React } from '@web3-react/core';
import { fixNumber } from '@src/utils';
import ConnectModal from '@components/ConnectModal';
import { useModal } from '@src/widgets/Modal';
import useAuth from '@src/hooks/useAuth';
import { RootStore } from '@src/store/RootStore';
import { inject, observer } from "mobx-react";

interface IPoolsPanel {
     poolList: IPool[],
    //  selectedPool: number,
    //  setSelectedPool: any,
     rootStore?: RootStore
}

interface IButtonState {
    type: 'default' | 'disabled';
    text: 'Enable' | 'Donate' | 'Confirming...' | 'Insufficient balance' | 'Enter number' | 'Connect'
}

const Panel = inject("rootStore")(observer((props: IPoolsPanel) => {
    const hubnateContract = useHubnate();
    const { account } = useWeb3React();
    const [cost, setCost] = useState<number>(0);
    const [chance, setChance] = useState<number>(0);
    const [amount, setAmount] = useState<number>(1);
    const [buttonState, setButtonState] = useState<IButtonState>(
        {
            type: 'default',
            text: 'Connect'
        }
    )
    const [allowance, setAllowance] = useState<boolean>(true);
    const [wait, setWait] = useState<boolean>(false)
    const [userBalance, setUserBalance] = useState<number>(0)
    const { login } = useAuth()
    let token = useERC20(props.poolList[props.rootStore.user.selectedPool].token.address[4])

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
        let poolId = props.poolList[props.rootStore.user.selectedPool].id;
        setWait(true)   
        let donate = await hubnateContract.methods.donate(124, poolId, amount).send({ from: account })
        
        if (donate) {
            console.log(donate)
            setWait(false)
        }
    }

    useEffect(() => {
        const getUserTokenBalance = async () => {
            if (!account) return;

            let response = await token.methods.balanceOf(account).call()
            // const currentBalance = new BigNumber(response)
            // console.log('currentBalance', fixNumber(response, 18))

            if (response) {
                setUserBalance(fixNumber(response, 18))
            }
        }

        getUserTokenBalance()
    }, [account, token])

    useEffect(() => {
        const getTicketCost = async () => {
            let pool = props.poolList[props.rootStore.user.selectedPool].costPerTicket ? props.poolList[props.rootStore.user.selectedPool] : false
            let fixAmount = amount ? amount : 0;
            if (pool) {
                let costToBuyTickets = pool.costPerTicket * Number(fixAmount);
                setCost(costToBuyTickets)
            }
        }

        const getChance = async () => {
            let pool = props.poolList[props.rootStore.user.selectedPool]
            let fixAmount = amount ? Number(amount) : 0
            if (pool) {
                // console.log(fixAmount, pool.userDonated, pool.totalDonated, pool.totalDonated + fixAmount)
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
    }, [amount, props.rootStore.user.selectedPool, account, props.poolList, token]);

    let [onPresentConnectModal] = useModal(
        <ConnectModal 
            login = {login}
        />
    )

    const onClickButton = (index: number) => {
        switch (buttonState.text) {
            case 'Connect':
                onPresentConnectModal()
                // console.log('connect action')
                break;
            case 'Enable':
                onClickEnable()
                // console.log('enabling action')
                break;
            case 'Donate':
                onClickDonate()
                // console.log('donate action')
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

        if (!props.poolList[props.rootStore.user.selectedPool].costPerTicket) {
            setButtonState({
                type: 'default',
                text: 'Connect'
            })
            return;
        }

        if (userBalance >= amount * props.poolList[props.rootStore.user.selectedPool].costPerTicket) {
        
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
    }, [amount, account, props.rootStore.user.selectedPool, token, wait, allowance, userBalance])

    const onChangeAmount = (e: any) => {
        setAmount(e.target.value.replace(/^0|\D/g, ''))
    }

    return (
        <div className="pools_panel">
            <div className="pools_panel__menu">
                <div className="pools_panel__menu_route">
                    <p className="pools_panel__menu_route-enabled">Donate</p>
                    <p>Exchange</p>
                </div>
                <div className="pools_panel__menu_control">
                    {/* <div className="pools_panel__menu_control__box">

                    </div>
                    <div className="pools_panel__menu_control__box">
                        
                    </div> */}
                </div>
            </div>
            <form className="pools_panel__content">
                <h2>Pool</h2>
                <Selector 
                    poolList = {props.poolList}
                />
                <div className="pools_panel__content_input__title">
                    <h2>Amount</h2>
                    <p>Balance: {userBalance}</p>
                </div>
                <input 
                    required
                    min = {1}
                    max = {userBalance / (props.poolList[props.rootStore.user.selectedPool].costPerTicket ? props.poolList[props.rootStore.user.selectedPool].costPerTicket : 1)}
                    value = {amount}
                    onChange = {onChangeAmount}
                    pattern = "^[0-9]"
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
    )
}))

export default Panel;