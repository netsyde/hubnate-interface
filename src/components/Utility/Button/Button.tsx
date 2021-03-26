interface IButton {
    name: string,
    link: string,
    isTransparent: boolean,
    padding?: string
}

const Button = (props: IButton) => {
    return <a className={props.isTransparent ? "transparent-button" : "hubnate-button"} href={props.link} style={{padding: props.padding}}>
        <p>
            {props.name}
        </p>
    </a>
}

export default Button