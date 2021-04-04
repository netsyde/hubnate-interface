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
        name: "Chain",
        link: '#',
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