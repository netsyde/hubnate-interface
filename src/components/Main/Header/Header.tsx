interface IMenuItem {
    name: string,
    link: string,
    isButton?: boolean
}

interface IHeader {
    className: string,
    logo: ILogo,
    menu: IMenu
}

interface IMenu {
    className: string,
    items: IMenuItem[]
}


interface ILogo {
    className: string,
    name: string
}

const MenuItem = (props: IMenuItem) => {
    return <a className={props.isButton ? "hubnate-button" : "header_menu__link"} href={props.link}>
        <p>
            {props.name}
        </p>
    </a>
}

const Menu = (props: IMenu) => {
    console.log(props.items)
    return <div className={props.className}>
        {props.items.map((item, index) => 
            <MenuItem key={index} link={item.link} name={item.name} isButton={item.isButton}/>
        )}
    </div>

}

const Logo = (props: ILogo) => {
    return <div className={props.className}>
        <p>{props.name}</p>
    </div>
}

const Header = (props: IHeader) => {
    return <header className={props.className}>
        <Logo className={props.logo.className} name={props.logo.name}/>
        <Menu className={props.menu.className} items={props.menu.items}/>
    </header>
}

export default Header;