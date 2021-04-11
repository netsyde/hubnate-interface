interface IHeader {
    className: string,
    children?: React.ReactNode,
}

const Header = (props: IHeader) => {
    return (
        <header className = {props.className}>
            {props.children}
        </header>
    )
}

export default Header;