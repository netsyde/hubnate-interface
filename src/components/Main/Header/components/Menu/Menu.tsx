const menu = require('@images/ui/menu.svg')

interface IMenu {
    className: string,
    isMobile: boolean,
    children?: React.ReactNode,
}

const Menu = (props: IMenu) => {
    if (props.isMobile) return null;

    return (
        <div className={props.className}>
            {props.children}
        </div>
    )

}

export default Menu;