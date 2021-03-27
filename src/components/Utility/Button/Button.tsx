import { MouseEventHandler } from "react";

interface IButton {
    name: string,
    link: string,
    type: ButtonType,
    padding?: string,
    onClick?: MouseEventHandler<HTMLAnchorElement>,
    className?: string
}

type ButtonType = 'transparent' | 'default' | 'disabled';

const Button = (props: IButton) => {
    return <a className={`${props.type}-button ${props.className}`} href={props.link} style={{padding: props.padding}} onClick={props.onClick}>
        <p>
            {props.name}
        </p>
    </a>
}

export default Button