import { IButton } from '@src/types/Utility'


const Button = (props: IButton) => {
    return <a className={`${props.type}-button ${props.className}`} href={props.link} style={{padding: props.padding}} onClick={props.onClick}>
        <p>
            {props.name}
        </p>
    </a>
}

export default Button;