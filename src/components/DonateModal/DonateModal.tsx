import { IPool } from '@src/types/Pools'
import { Button } from '@components/Utility';
import React, { useState, useEffect } from "react";
import { useHubnate, useERC20 } from '@src/hooks/useContract'
import { useWeb3React } from '@web3-react/core';
import { approve } from '@src/utils/callHelpers';
import { fixNumber } from '@src/utils';
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';

interface IDonateModal {
    fade?: Fade,
    pools: IPool[] | false,
    style?: any,
    onDismiss?: any,
    rootStore?: RootStore
}

type Fade = 'fadeIn' | 'fadeOut' | ''

const DonateModal = inject("rootStore")(observer((props: IDonateModal) => {
    const hubnateContract = useHubnate()
    const [amount, setAmount] = useState<number>();
    const [cost, setCost] = useState<number>(0);
    const [chance, setChance] = useState<number>(0);
    const [allowance, setAllowance] = useState<boolean>(false);
    const [wait, setWait] = useState<boolean>(false)
    const { account } = useWeb3React()
    const [userBalance, setUserBalance] = useState<number>(0)
    // let [selectedPool, setSelectedPool] = useState<number>(0);

    if (props.pools) {
        let token = useERC20(props.pools[props.rootStore.user.selectedPool].token.address[4])

        const onClickDonate = async () => {
            let poolId = props.pools ? props.pools[props.rootStore.user.selectedPool].id : 1;
            setWait(true)   
            let donate = await hubnateContract.methods.donate(124, poolId, amount).send({ from: account })
            if (donate) {
                props.onDismiss()
                console.log(donate)
                setWait(false)
            }
        }

        const onClickEnable = async () => {
            setWait(true)
            let approveTx = await approve(token, hubnateContract, account, ethers.constants.MaxUint256)
            if (approveTx) {
                setAllowance(true)
                setWait(false)
            }
            console.log(approveTx)
        }

        const modalOnClick = (e: any) => {
            e.stopPropagation();
        }

        const onChangeAmount = (e: any) => {
            setAmount(e.target.value.replace(/\D/g, ''))
        }

        const onChangePool = (e: any) => {
            console.log('onchange pool')
            props.rootStore.user.setSelectedPool(e.target.value)

        }


        useEffect(() => {
            const getTicketCost = async () => {
                let pool = props.pools ? props.pools[props.rootStore.user.selectedPool] : false
                let fixAmount = amount ? amount : 0;
                if (pool) {
                    let costToBuyTickets = pool.costPerTicket * Number(fixAmount);
                    setCost(costToBuyTickets)
                }
            }

            const getChance = async () => {
                let pool = props.pools ? props.pools[props.rootStore.user.selectedPool] : false
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
        }, [amount, props.rootStore.user.selectedPool]);

        useEffect(() => {
            const getUserTokenBalance = async () => {
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
            const getAllowance = async () => {
                try {   
                    let response = await token.methods.allowance(account, hubnateContract.options.address).call()
                    const currentAllowance = new BigNumber(response)
                    console.log(currentAllowance)
                    setAllowance(currentAllowance.gt(0))
                } catch (e) {
                    console.log(e)
                    return false
                }
            }
            
            getAllowance()
            console.log(allowance)
        }, [account, token, allowance])

        return (
            <div className = {`donate-modal ${props.fade}`} style={props.style} onClick = {modalOnClick}>
                <div className="donate-modal_group">
                    <h2 className="donate-modal__title">Asset</h2>
                    <select 
                        className="donate-modal__input"
                        value = {props.rootStore.user.selectedPool}
                        onChange = {onChangePool}
                    >
                        
                        {props.pools.map((pool: IPool, index: number) => 
                            <option className="donate-modal__input_option"
                                key = {index}
                                value = {index}
                            >
                                {pool.token.name}
                            </option>
                        )}
                    </select>
                </div>
                <div className="donate-modal_group">
                    <h2 className="donate-modal__title">Amount</h2>
                    <input 
                        type = "number"
                        className = "donate-modal__input"
                        pattern = "^[0-9]*$"
                        value = {amount}
                        onChange = {onChangeAmount}
                        max = {userBalance}
                        placeholder = "0"
                    />
                </div>
                <Button 
                    name = {wait ? 'Confirming...' : (allowance ? `Donate` : 'Enable')}
                    link = {`#`}
                    type = {wait ? 'disabled' : 'default'}
                    padding = "10px 100px"
                    onClick = {allowance ? onClickDonate : onClickEnable}
                />
                <div className="donate-modal_meta">
                    <div className="donate-modal_meta__group">
                        <p className="donate-modal_meta__group_key">Cost to buy tickets</p>
                        <p className="donate-modal_meta__group_value">{cost}</p>
                    </div>
                    <div className="donate-modal_meta__group">
                        <p className="donate-modal_meta__group_key">Chance recieve</p>
                        <p className="donate-modal_meta__group_value">{chance}%</p>
                    </div>
                    <div className="donate-modal_meta__group">
                        <p className="donate-modal_meta__group_key">Tokens available</p>
                        <p className="donate-modal_meta__group_value">{userBalance}</p>
                    </div>
                </div>
            </div>
        )
    }
}))

export default DonateModal;