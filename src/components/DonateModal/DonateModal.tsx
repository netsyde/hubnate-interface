import { IPool } from '@src/types/Pools'
import { Button } from '@components/Utility'
import React, { useState, useEffect } from "react";
import { useDonate } from '@src/hooks/useContract'

interface IDonateModal {
    fade?: Fade,
    pools: IPool[],
    selectedPool: string,
    setSelectedPool: any,
    style?: any,
    // onClick
}

type Fade = 'fadeIn' | 'fadeOut' | ''

const DonateModal = React.forwardRef((props: IDonateModal, ref: any) => {
    const donateContract = useDonate()
    const [amount, setAmount] = useState<number>(0);
    const [cost, setCost] = useState<number>(0);

    const onClickDonate = async () => {
        alert('not implemented')
    }

    const modalOnClick = (e: any) => {
        console.log(e)
        e.stopPropagation();
    }

    const onChanceAmount = (e: any) => {
        setAmount(e.target.value.replace(/\D/g, ''))
    }

    const onChangePool = (e: any) => {
        console.log(e.target.value)
        props.setSelectedPool(Number(e.target.value))

    }

    useEffect(() => {
        const getTicketCost = async () => {
            let fixAmount = amount ? amount : 0;
            let costToBuyTickets = await donateContract.methods.costToBuyTickets(1, fixAmount).call()
            console.log(costToBuyTickets)
            setCost(Number((costToBuyTickets / Math.pow(10, 18)).toFixed(0)))
        }

        getTicketCost()
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
                            {pool.name}
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
                    onChange = {onChanceAmount}
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
                    <p className="donate-modal_meta__group_value">{0}%</p>
                </div>
                
                <div className="donate-modal_meta__group">
                    <p className="donate-modal_meta__group_key">Fee</p>
                    <p className="donate-modal_meta__group_value">0.003 BNB</p>
                </div>
            </div>
        </div>
    )
})

export default DonateModal;