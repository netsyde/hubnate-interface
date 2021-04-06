const settings = require('@images/ui/settings.svg')
import { IContainer } from '@src/types/Utility'

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

