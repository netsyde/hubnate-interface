import { Button, Table } from '@components/Utility';
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


    return <div className = {`pools_container ${calcShadow(props.openDonateModal)}`} onClick={() => props.openDonateModal === true ? closeDonatModal() : null}>
        <div className="pools_container__title">
            <h1>Pools</h1>
            <img onClick = {(e) => onClickSettings(e)}src={settings} alt="settings"/>
        </div>
        
       <Table 
            elements = {props.pools}
            onClickDonate = {onClickDonate}
            openDonateModal = {props.openDonateModal}
       />
    </div>
}

export default PoolContainer;