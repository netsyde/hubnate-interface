import { IPool } from '@src/types/Pools'
import { Button } from '@components/Utility'
import React from "react";

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

    const onClickDonate = () => {
        alert('not implemented')
    }

    const modalOnClick = (e: any) => {
        console.log(e)
        e.stopPropagation();
    }
    return (
        <div className = {`donate-modal ${props.fade}`} style={props.style} ref = {ref} onClick = {modalOnClick}>
            <div className="donate-modal_group">
                <h2 className="donate-modal__title">Asset</h2>
                <select 
                    className="donate-modal__input"
                    value = {props.selectedPool}
                    onChange = {(e) => props.setSelectedPool(e.target.value)}
                >
                    
                    {props.pools.map((pool: IPool, index: number) => 
                        <option className="donate-modal__input_option"
                            key = {index}
                            value = {pool.name}
                        >
                            {pool.name}
                        </option>
                    )}
                </select>
            </div>
            <div className="donate-modal_group">
                <h2 className="donate-modal__title">Amount</h2>
                <input type="number" className="donate-modal__input"/>
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