import { Button, Table } from '@components/Utility';
import { MouseEventHandler } from 'react';
const settings = require('@images/ui/settings.svg')
import DonateModal from '@components/DonateModal'
import { Pools } from '@src/types' //'../../../types/'

interface IContainer {
    title: string,
    className?: string,
    onClick?: MouseEventHandler<HTMLDivElement>,
    children: React.ReactNode,
    onClickElement?: MouseEventHandler<HTMLDivElement>,
    address?: string
}

const Container = (props: IContainer) => {

    return (
        <div className = {`container ${props.className}`} onClick={props.onClick}>
            <div className="container__title">
                <h1>{props.title}</h1>
                {props.address ? <p onClick = {props.onClickElement}>{props.address}</p> : <img onClick = {props.onClickElement} src={settings} alt="settings"/>}
            </div>
            {props.children}
        </div>
    )
}

export default Container;

