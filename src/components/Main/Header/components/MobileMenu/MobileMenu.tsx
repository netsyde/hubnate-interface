const menu = require('@images/ui/menu.svg')

interface IMobileMenu {

}

const MobileMenu = (props: IMobileMenu) => {

    return (
        <img src = {menu} alt="menu" className = {'header_menu-mobile'}/>
    )
}

export default MobileMenu;