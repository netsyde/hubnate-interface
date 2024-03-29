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
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next'
const sync = require('@images/ui/sync-solid.svg')
import { useSnackbar } from '@src/widgets/Snackbar'

interface IPoolsPanel {
     poolList: IPool[],
     rootStore?: RootStore
}


interface IButtonState {
    type: 'default' | 'disabled';
    id: 'enable' | 'donate' | 'confirming' | 'insufficientBalance' | 'enterNumber' | 'connect'
    text: string
}

const Panel = inject("rootStore")(observer((props: IPoolsPanel) => {
    const { t } = useTranslation()
    const hubnateContract = useHubnate();
    const { account } = useWeb3React();
    const [cost, setCost] = useState<number>(0);
    const [chance, setChance] = useState<number>(0);
    const [amount, setAmount] = useState<number>(1);
    const [buttonState, setButtonState] = useState<IButtonState>(
        {
            type: 'default',
            text: t("panel.buttons.connect"),
            id: 'connect'
        }
    )
    const [allowance, setAllowance] = useState<boolean>(true);
    const [wait, setWait] = useState<boolean>(false)
    const [userBalance, setUserBalance] = useState<number>(0)
    const { login } = useAuth()
    let token = useERC20(props.poolList[props.rootStore.user.selectedPool].token.address[4])
    const { addAlert } = useSnackbar() 

    const onClickEnable = async () => {
        try {
            setWait(true)
            let approveTx = await approve(token, hubnateContract, account, ethers.constants.MaxUint256)
            if (approveTx) {
                setAllowance(true)
                setWait(false)
                addAlert(t('txs.approved'))
            }
            console.log(approveTx)
        } catch (e) {
            addAlert(e.message)
            setWait(false)
            console.log(e);
            return false;
        }
    }

    const onClickDonate = async () => {
        try {
            let poolId = props.poolList[props.rootStore.user.selectedPool].id;
            setWait(true)   
            let donate = await hubnateContract.methods.donate(124, poolId, amount).send({ from: account })
            
            if (donate) {
                console.log(donate)
                setWait(false)
                addAlert(t('txs.donate'))
            }
        } catch (e) {
            addAlert(e.message)
            setWait(false)
            console.log(e);
            return false;
        }
    }

    useEffect(() => {
        try {
            const getUserTokenBalance = async () => {
                if (!account) return;

                let response = await token.methods.balanceOf(account).call()

                if (response) {
                    setUserBalance(fixNumber(response, 18))
                }
            }

            getUserTokenBalance()
        } catch (e) {
            console.log(e);
            addAlert(t('errors.getUserTokenBalance'))
            addAlert(e.message)
        }
    }, [account, token, wait])

    useEffect(() => {
        try {
            const getAutoUpdate = async () => {
                try {
                    let autoUpdate = window.localStorage.getItem("autoUpdate")

                    if (autoUpdate) {
                        // console.log('auto upd', JSON.parse(autoUpdate))
                        props.rootStore.user.setAutoUpdate(JSON.parse(autoUpdate))
                        if (JSON.parse(autoUpdate)) {
                            props.rootStore.user.setAutoUpdateObserver()
                        }
                    }
                } catch (e) {
                    console.log(e)
                    addAlert(e.message)
                }
            }

            getAutoUpdate()
        } catch (e) {
            console.log(e);
            addAlert(t('errors.getAutoUpdate'))
        }
    }, [props.rootStore.user.autoUpdate])

    useEffect(() => {
        try {
            const getAllowance = async () => {
                try {
                    if (account) {
                        let response = await token.methods.allowance(account, hubnateContract.options.address).call()
                        const currentAllowance = new BigNumber(response)
                        setAllowance(currentAllowance.gt(0))
                    }
                } catch (e) {
                    console.log(e)
                    addAlert(e.message)
                    return false
                }
            }
            
            getAllowance()
            // console.log(allowance)
        } catch (e) {
            console.log(e)
            addAlert(t('errors.getAllowance'))
        }
    }, [account, token, allowance])

    useEffect(() => {
        try {
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
        } catch (e) {
            console.log(e)
            addAlert(e.message)
            
        }
    }, [amount, props.rootStore.user.selectedPool, account, props.poolList, token]);

    let [onPresentConnectModal] = useModal(
        <ConnectModal 
            login = {login}
        />
    )

    const onClickButton = (index: number) => {
        try {
            switch (buttonState.id) {
                case 'connect':
                    onPresentConnectModal()
                    break;
                case 'enable':
                    onClickEnable()
                    break;
                case 'donate':
                    onClickDonate()
                    break;
            }
        } catch (e) {
            console.log(e)
            addAlert(e.message)
        }
    }

    const onClickSync = () => {
        try {
            const currentAutoUpdate = window.localStorage.getItem("autoUpdate")
            let newAutoUpdate = !JSON.parse(currentAutoUpdate)
            window.localStorage.setItem("autoUpdate", newAutoUpdate.toString());
            props.rootStore.user.setAutoUpdate(newAutoUpdate)
        } catch (e) {
            window.localStorage.setItem("autoUpdate", 'false');
            props.rootStore.user.setAutoUpdate(false)
            console.log(e)
            addAlert(e.message)
        }
    }

    const onClickSettings = () => {
        alert('not implemented')
    }

    useEffect(() => {
        try {
            if (!account) {
                setButtonState({
                    type: 'default',
                    text: t("panel.buttons.connect"),
                    id: 'connect'
                })
                return;
            }

            if (Number(amount) == 0) {
                setButtonState({
                    type: 'disabled',
                    text: t("panel.buttons.enterNumber"),
                    id: 'enterNumber'
                })
                return;
            }

            if (!props.poolList[props.rootStore.user.selectedPool].costPerTicket) {
                setButtonState({
                    type: 'default',
                    text: t("panel.buttons.connect"),
                    id: 'connect'
                })
                return;
            }

            if (wait) {
                setButtonState({
                    type: 'disabled',
                    text: t("panel.buttons.confirming"),
                    id: 'confirming'
                })
                return;
            }

            if (userBalance >= amount * props.poolList[props.rootStore.user.selectedPool].costPerTicket) {
            
                if (allowance) {
                    setButtonState({
                        type: 'default',
                        text: t("panel.buttons.donate"),
                        id: 'donate'
                    })
                } else {
                    setButtonState({
                        type: 'default',
                        text: t("panel.buttons.enable"),
                        id: 'enable'
                    })
                }
            } else {
                setButtonState({
                    type: 'disabled',
                    text: t("panel.buttons.insufficientBalance"),
                    id: 'insufficientBalance'
                })
            }
        } catch (e) {
            console.log(e)
            addAlert(e.message)
        }
    }, [amount, account, props.rootStore.user.selectedPool, token, wait, allowance, userBalance, props.poolList])

    const onChangeAmount = (e: any) => {
        try {
            setAmount(e.target.value.replace(/^0|\D/g, ''))
        } catch (e) {
            console.log(e)
            addAlert(e.message)
        }
    }

    return (
        <div className="pools_panel">
            <div className="pools_panel__menu">
                <div className="pools_panel__menu_route">
                    <p className="pools_panel__menu_route-enabled">{t("panel.labels.donate")}</p>
                    <p>{t("panel.labels.exchange")}</p>
                </div>
                <div className="pools_panel__menu_control">
                    {/* {/* <div className="pools_panel__menu_control__box">

                    </div> */}
                    <div 
                        className={
                            props.rootStore.user.autoUpdate ? 
                                "pools_panel__menu_control__box"
                                :
                                "pools_panel__menu_control__box pools_panel__menu_control__box-disabled"
                            }
                        onClick = {onClickSync}
                    >
                        <img src={sync} alt="sync" />
                    </div>
                </div>
            </div>
            <form className="pools_panel__content">
                <h2>{t("panel.input.pool")}</h2>
                <Selector 
                    poolList = {props.poolList}
                />
                <div className="pools_panel__content_input__title">
                    <h2>{t("panel.input.amount")}</h2>
                    <p>{t("panel.input.balance")}: {userBalance}</p>
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
                    <StatsItem title={t("panel.stats.newChance")} value={chance}/>
                    <StatsItem title={t("panel.stats.costToBuyTickets")} value={cost}/>
                    {/* <StatsItem title={"Estimated Fee"} value={0.001}/> */}
                </div>
            </form>
        </div>
    )
}))

export default Panel;