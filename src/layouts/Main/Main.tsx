import { Header } from '@components/Main'

interface IMain {
    children: React.ReactNode
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
    return (
        <div className = "main">
            <div className = "main_opacity">
                <Header 
                    className = "header"
                    logo = {{
                        className: "header_logo",
                        name: "Hubnate"
                    }}
                    menu = {{
                        className: "header_menu",
                        items: menuItems
                    }}
                />
                {props.children}
            </div>
        </div>
    )
}

export default Main