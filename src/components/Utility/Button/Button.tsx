import { MouseEventHandler } from "react";
import { Utility } from '@src/types'


const Button = (props: Utility.IButton) => {
    return <a className={`${props.type}-button ${props.className}`} href={props.link} style={{padding: props.padding}} onClick={props.onClick}>
        <p>
            {props.name}
        </p>
    </a>
}

export default Button