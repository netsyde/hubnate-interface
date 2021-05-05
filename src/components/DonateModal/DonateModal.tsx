import { IPool } from '@src/types/Pools'
import { Button } from '@components/Utility';
import React, { useState, useEffect } from "react";
import { useDonate, useERC20 } from '@src/hooks/useContract'
import { useWeb3React } from '@web3-react/core';
import { approve } from '@src/utils/callHelpers';
import { fixNumber } from '@src/utils';

interface IDonateModal {
    fade?: Fade,
    pools: IPool[] | false,
    selectedPool: number,
    setSelectedPool: any,
    style?: any,
}

type Fade = 'fadeIn' | 'fadeOut' | ''

const DonateModal = React.forwardRef((props: IDonateModal, ref: any) => {
    const donateContract = useDonate()
    const [amount, setAmount] = useState<number>(0);
    const [cost, setCost] = useState<number>(0);
    const [chance, setChance] = useState<number>(0);

    const { account } = useWeb3React()
    if (props.pools) {
        let token = useERC20(props.pools[props.selectedPool].token.address[4])

        const onClickDonate = async () => {
            let poolId = props.pools ? props.pools[props.selectedPool].id : 1;
            let price = await donateContract.methods.costToBuyTickets(poolId, amount).call()

            let approveTx = await approve(token, donateContract, account, price)
            console.log(approveTx)

            let donate = await donateContract.methods.donate(124, poolId, amount).send({ from: account })
            console.log(donate)
        }

        const modalOnClick = (e: any) => {
            e.stopPropagation();
        }

        const onChangeAmount = (e: any) => {
            setAmount(e.target.value.replace(/\D/g, ''))
        }

        const onChangePool = (e: any) => {
            props.setSelectedPool(Number(e.target.value))

        }

        useEffect(() => {
            const getTicketCost = async () => {
                let pool = props.pools ? props.pools[props.selectedPool] : false
                let fixAmount = amount ? amount : 0;
                if (pool) {
                    let costToBuyTickets = pool.costPerTicket * Number(fixAmount);
                    setCost(costToBuyTickets)
                }
            }

            const getChance = async () => {
                let pool = props.pools ? props.pools[props.selectedPool] : false
                let fixAmount = amount ? Number(amount) : 0
                if (pool) {
                    console.log(fixAmount, pool.totalDonated, pool.totalDonated + fixAmount)
                    let chance = Number(( ( (fixAmount + pool.userDonated) / (pool.totalDonated + fixAmount) ) * 100).toFixed(2))

                    if (chance > 100) {
                        setChance(100)
                    } else {
                        setChance(chance)
                    }
                    
                }
                
            }

            getTicketCost()
            getChance()
        }, [amount, props.selectedPool]);

        return (
            <div className = {`donate-modal ${props.fade}`} style={props.style} ref = {ref} onClick = {modalOnClick}>
                <div className="donate-modal_group">
                    <h2 className="donate-modal__title">Asset</h2>
                    <select 
                        className="donate-modal__input"
                        value = {props.selectedPool}
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
                    />
                </div>
                <Button 
                    name = "Donate"
                    link = {`#`}
                    type = {'default'}
                    padding = "10px 100px"
                    onClick = {() => onClickDonate()}
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
                        <p className="donate-modal_meta__group_key">Fee</p>
                        <p className="donate-modal_meta__group_value">0.003 BNB</p>
                    </div>
                </div>
            </div>
        )
    }
})

export default DonateModal;