import { Header } from '@components/Main'
import { Menu, MenuItem, Logo, MobileMenu } from '@components/Main/Header/components'
import { useWindowSize } from '@src/utils';

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IMain {
    children: React.ReactNode,
    headerClassName?: string,
    logoColor?: 'white' | 'blue',
    className?: string
}

const menuItems = [
    {
        name: "Pools",
        link: '/pools',
        isButton: false
    },
    {
        name: "Account",
        link: '/account/0xaC0dB4c98A3C2dDaa16Fe54B0487F86b227F7B1d',
        isButton: false
    },
    {
        name: "Community",
        link: '#',
        isButton: false
    },
    {
        name: "About",
        link: '#',
        isButton: false
    },
    {
        name: "Use Hubnate",
        link: '#',
        isButton: true
    }
]

const Main = (props: IMain) => {
    const size = useWindowSize();

    return (
        <div className = {`main ${props.className}`}>
            <div className = "main_opacity">
                <Header 
                    className = {`header ${props.headerClassName}`}
                >
                    <Logo 
                        className = {`header_logo`}
                        name = "Hubnate"
                        isMobile = {isMobile(size.width)}
                        color = {props.logoColor}
                    />
                    <Menu
                        className = {'header_menu'}
                        isMobile = {isMobile(size.width)}
                    >
                        {menuItems.map((item, index) =>
                            <MenuItem 
                                key = {index}
                                name = {item.name}
                                link = {item.link}
                                isButton = {item.isButton}
                            />
                        )}
                    </Menu>
                </Header>
                {props.children}
            </div>
        </div>
    )
}

export default Main