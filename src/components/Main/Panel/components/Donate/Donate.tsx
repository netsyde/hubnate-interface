import { Selector, StatsItem } from '../';
import { useSnackbar } from '@src/widgets/Snackbar'
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import { ethers } from 'ethers'
import { approve } from '@src/utils/callHelpers';
import { useWeb3React } from '@web3-react/core';
import { fixNumber } from '@src/utils';
import { useTranslation } from 'next-i18next'
import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { IPool } from '@src/types/Pools';
import { RootStore } from '@src/store/RootStore';
import BigNumber from 'bignumber.js';
import { useModal } from '@src/widgets/Modal';
import useAuth from '@src/hooks/useAuth';
import ConnectModal from '@components/ConnectModal';
import { Button } from '@components/Utility';
import Skeleton from 'react-loading-skeleton';

interface IButtonState {
    type: 'default' | 'disabled';
    id: 'enable' | 'donate' | 'confirming' | 'insufficientBalance' | 'enterNumber' | 'connect'
    text: string
}

interface IClaimState {
    type: 'default' | 'disabled';
    id: 'claim' | 'connect' | 'insufficientBalance'
    text: string
}

interface IPoolsPanel {
    poolList: IPool[],
    rootStore?: RootStore
}

const Donate = inject("rootStore")(observer((props: IPoolsPanel) => {
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
    const [claimState, setClaimState] = useState<IClaimState>(
        {
            type: 'disabled',
            text: t("claim.buttons.claim"),
            id: 'claim'
        }
    )
    const [allowance, setAllowance] = useState<boolean>(true);
    const [wait, setWait] = useState<boolean>(false)
    const [userBalance, setUserBalance] = useState<number>(0)
    const { login } = useAuth()
    let token = useERC20(props.poolList[props.rootStore.user.selectedPool].token.address[4])
    const { addAlert } = useSnackbar() 
    const [claiming, setClaiming] = useState<boolean>(false)

    let [onPresentConnectModal] = useModal(
        <ConnectModal 
            login = {login}
        />
    )

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

    const onClickButton = () => {
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
    const onClickClaim = async () => {
        try {
            console.log(claimState.id)
            switch (claimState.id) {
                case 'connect':
                    onPresentConnectModal()
                    break;
                case 'claim':
                    claimTickets()
                    break;
            }
        } catch(e) {
            console.log(e)
        }
    }
    const claimTickets = async () => {
        try {
            let claimNumber = props.poolList[props.rootStore.user.selectedPool].userUnclaimed < 200 ? props.poolList[props.rootStore.user.selectedPool].userUnclaimed : 200
            setClaiming(true);
            let claim = await hubnateContract.methods.claimTickets(
                props.poolList[props.rootStore.user.selectedPool].id,
                claimNumber
            ).send({ from: account })

            if (claim) {
                setClaiming(false)
                addAlert(t('txs.claim'))
            }
        } catch (e) {
            console.log(e)
            setClaiming(false)
            addAlert(e.message)
        }
    }
    useEffect(() => {
        try {
            if (Number(props.poolList[props.rootStore.user.selectedPool].userUnclaimed) == 0) {
                setClaimState({
                    type: 'disabled',
                    text: t("claim.buttons.claim"),
                    id: 'claim'
                })
                return;
            }

            if (claiming) {
                setButtonState({
                    type: 'disabled',
                    text: t("panel.buttons.confirming"),
                    id: 'confirming'
                })
                return;
            }

            if (Number(props.poolList[props.rootStore.user.selectedPool].userUnclaimed) > 0) {
                setClaimState({
                    type: 'default',
                    text: t("claim.buttons.claim"),
                    id: 'claim'
                })
                return;
            }


        } catch (e) {
            console.log(e)
        }
    }, [account, props.rootStore.user.selectedPool, claiming, props.poolList[props.rootStore.user.selectedPool].userUnclaimed])
    
    return (
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
            <div className="pools_panel_claim">
                <div className="pools_panel_claim__radial">
                    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80" className="token-circle">
                        <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(136, 163, 200, 0.2)" strokeWidth="14" strokeDasharray="3, 5" transform="rotate(180 80 80)"></circle>
                        <mask id="myMask">
                            <circle cx="80" cy="80" r="72" fill="none" stroke="#fff" strokeWidth="14" strokeDasharray="3, 5" transform="rotate(182 80 80)"></circle>
                        </mask>
                        <circle cx="80" cy="80" r="72" fill="none" strokeWidth="14" strokeDashoffset="0" opacity="0.3" transform="rotate(180 80 80)" mask="url(#myMask)" strokeDasharray={`${(226 / 200 * props.poolList[props.rootStore.user.selectedPool].userUnclaimed).toFixed(0) || 0}, 226`} stroke="#8e44ad"></circle>
                            <circle cx="80" cy="80" r="72" fill="none" strokeWidth="14" strokeDashoffset="0" transform="rotate(180 80 80)" mask="url(#myMask)" strokeDasharray={`${(226 / 200 * props.poolList[props.rootStore.user.selectedPool].userUnclaimed).toFixed(0) || 0}, 226`} stroke="#8e44ad"></circle>
                        <circle cx="80" cy="80" r="60" fill="none" strokeWidth="1" strokeDashoffset="0" stroke="rgba(136, 163, 200, 0.2)" strokeDasharray="377" transform="rotate(180 80 80)"></circle> 
                    </svg>
                    <div className="pools_panel_claim__radial_info">
                    <p className="pools_panel_claim__radial_info__value">
                            {props.poolList[props.rootStore.user.selectedPool].userUnclaimed || <Skeleton />}
                        </p>
                        <p className="pools_panel_claim__radial_info__title">
                            {t('panel.claim.available')}
                        </p>
                    </div>
                </div>
                <Button 
                    name = {claimState.text}
                    type = {claimState.type}
                    padding = "10px 100px"
                    onClick = {onClickClaim}
                />
            </div>
        </form>
    )
}))

export default Donate;