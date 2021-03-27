import { Button } from '@components/Utility';
import { MouseEventHandler } from 'react';
const settings = require('@images/ui/settings.svg')
import DonateModal from '@components/DonateModal'
import { Pools } from '@src/types' //'../../../types/'

const PoolContainer = (props: Pools.IPoolContainer) => {

    const onClickSettings = (e: any) => {
        alert('not implemented')
    }

    const onClickDonate = (pool: Pools.IPool) => {
        props.setSelectedPool(pool.name)
        props.setOpenDonateModal(true)
    }

    const closeDonatModal = () => {
        props.setOpenDonateModal(false)
    }

    const calcShadow = (donateModalState: any) => {
        switch (donateModalState) {
            case 'initial': return ''
            case true: return 'pools_container-shadow';
            case false: return 'pools_container-shadowOut'
        }
    }

    const convertNumber = (number: number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return <div className = {`pools_container ${calcShadow(props.openDonateModal)}`} onClick={() => props.openDonateModal === true ? closeDonatModal() : null}>
       <div>
        <div className="pools_container__title">
            <h1>Pools</h1>
            <img onClick = {(e) => onClickSettings(e)}src={settings} alt="settings"/>
        </div>
        
       <table className = "pools_container__table">
           <tbody>
               {props.pools.map((pool: Pools.IPool, index: number) =>
                    <tr key = {index} style={pool.active ? null : {filter: "blur(5.2px)", userSelect: 'none'}}>                       
                        <td>
                            <div className = "pools_container__table_token">
                                <img className = "pools_container__table_token__icon" src={pool.logotype} alt="BNB"/>
                                <p className = "pools_container__table_token__ticker">{pool.name}</p>
                            </div>
                        </td>
                        <td>
                            <p className = "pools_container__table_meta">Total donated</p>
                            <p className = "pools_container__table_meta-number">${convertNumber(pool.totalDonated)}</p>
                        </td>
                        <td>
                            <p className = "pools_container__table_meta">Chance</p>
                            <p className = "pools_container__table_meta-number">{pool.chance}%</p>
                        </td>
                        <td>
                            <p className = "pools_container__table_meta">Your Deposit</p>
                            <p className = "pools_container__table_meta-number">${convertNumber(pool.yourDeposit)}</p>
                        </td>
                        <td>
                            <p className = "pools_container__table_meta">Donaters</p>
                            <p className = "pools_container__table_meta-number">{convertNumber(pool.donaters)}</p>
                        </td>
                        <td>
                            <Button 
                                name = "Donate"
                                link = {`#${pool.name}`}
                                type = {pool.active ? 'default' : 'disabled'}
                                padding = "10px 100px"
                                onClick = {pool.active ? () => onClickDonate(pool) : null}
                                className = {props.openDonateModal == true ? 'blocked-selection' : ''}
                            />
                        </td>
                    </tr>
                )}
            </tbody>
       </table>
       </div>
    </div>
}

export default PoolContainer;