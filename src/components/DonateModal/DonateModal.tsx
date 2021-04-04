import { Pools } from '@src/types'
import { Button } from '@components/Utility'

interface IDonateModal {
    fade: Fade,
    pools: Pools.IPool[],
    selectedPool: string,
    setSelectedPool: any
}

type Fade = 'fadeIn' | 'fadeOut' | ''

const DonateModal = (props: IDonateModal) => {

    const onClickDonate = () => {
        alert('not implemented')
    }
    return <div className = {`donate-modal ${props.fade}`}>
        <div className="donate-modal_group">
            <h2 className="donate-modal__title">Asset</h2>
            <select 
                className="donate-modal__input"
                value = {props.selectedPool}
                onChange = {(e) => props.setSelectedPool(e.target.value)}
            >
                
                {props.pools.map((pool: Pools.IPool, index: number) => 
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
}

export default DonateModal;