interface IButton {
    name: string,
    link: string,
    type: ButtonType,
    padding?: string,
}

type ButtonType = 'transparent' | 'default' | 'disabled';

const Button = (props: IButton) => {
    return <a className={`${props.type}-button`} href={props.link} style={{padding: props.padding}}>
        <p>
            {props.name}
        </p>
    </a>
}

export default Button