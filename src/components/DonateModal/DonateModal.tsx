import { IPool } from '@src/types/Pools'
import { Button } from '@components/Utility'
import React, { useState, useEffect } from "react";
import { useDonate, useERC20 } from '@src/hooks/useContract'
import { useWeb3React } from '@web3-react/core';
import { approve } from '@src/utils/callHelpers'

interface IDonateModal {
    fade?: Fade,
    pools: IPool[],
    selectedPool: number,
    setSelectedPool: any,
    style?: any,
}

type Fade = 'fadeIn' | 'fadeOut' | ''

const DonateModal = React.forwardRef((props: IDonateModal, ref: any) => {
    const donateContract = useDonate()
    const token = useERC20('0x8587591f38A197737B43Cd9415d5819100D623f9')
    const [amount, setAmount] = useState<number>(0);
    const [cost, setCost] = useState<number>(0);
    const { account } = useWeb3React()

    const receiveDonates = async () => {
        let pool = await donateContract.methods.getBasicPoolInfo(1).call()
        const getDonate = async (index: number) => {
                let donate = await donateContract.methods.getBasicDonateInfo(1, index).call()
                console.log(donate)
        }

        for (let i = 1; i < pool.donateIdCounter + 1; i++) {
            getDonate(i)
        }

        console.log(pool.donateIdCounter)
    }
    // receiveDonates()

    const onClickDonate = async () => {
        // alert('not implemented')
        let pool = await donateContract.methods.getBasicPoolInfo(1).call()
        console.log(pool)
        let donates = []
        let price = await donateContract.methods.costToBuyTickets(1, amount).call()
        console.log("price", price)
        let tokenApprove = await approve(token, donateContract, account, price)
        console.log(tokenApprove)
        console.log(amount)

        // const getDonate = async (index: number) => {
        //     let donate = await donateContract.methods.getBasicDonateInfo(1, index).call()
        //     console.log(donate)
        // }

        // for (let i = 0; i < pool.donateIdCounter; i++) {
        //     getDonate(i)
        // }

        // console.log(pool.donateIdCounter)

        let donate = await donateContract.methods.donate(124, 1, amount).send({ from: account })
        console.log(donate)
    }

    const modalOnClick = (e: any) => {
        e.stopPropagation();
    }

    const onChanceAmount = (e: any) => {
        setAmount(e.target.value.replace(/\D/g, ''))
    }

    const onChangePool = (e: any) => {
        props.setSelectedPool(Number(e.target.value))

    }

    useEffect(() => {
        const getTicketCost = async () => {
            let fixAmount = amount ? amount : 0;
            let costToBuyTickets = await donateContract.methods.costToBuyTickets(1, fixAmount).call()

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