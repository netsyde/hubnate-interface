import { Button, Table } from '@components/Utility';
import { MouseEventHandler } from 'react';
const settings = require('@images/ui/settings.svg')
import DonateModal from '@components/DonateModal'
import { Pools } from '@src/types' //'../../../types/'

interface IContainer {
    title: string,
    className?: string,
    onClick?: MouseEventHandler<HTMLDivElement>,
    children: React.ReactNode
}
const PoolContainer = (props: IContainer) => {

    const onClickSettings = (e: any) => {
        alert('not implemented')
    }

    return <div className = {`pools_container ${props.className}`} onClick={props.onClick}>
        <div className="pools_container__title">
            <h1>{props.title}</h1>
            <img onClick = {(e) => onClickSettings(e)}src={settings} alt="settings"/>
        </div>
       {props.children}
    </div>
}

export default PoolContainer;

