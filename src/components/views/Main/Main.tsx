import React, { useState, useEffect } from "react";
import "./Main.scss";
import { Header, Statistic } from './components'
import Description from "./components/Description";

const Main = () => {
    return <div className = "main">
        <div className = "main_opacity">
            <Header 
                className = "header"
                logo = {{
                    className: "header_logo",
                    name: "Hubnate"
                }}
                menu = {{
                    className: "header_menu",
                    items: [
                        {
                            name: "Chain",
                            link: '#',
                            isButton: false
                        },
                        {
                            name: "Developers",
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
                }}
            />
            <Description 
                title = "Random Donate System"
                description = "Donate to random people and increase the chance to get a reward from someone else."
                buttons = {{
                    items: [
                        {
                            name: 'Use Hubnate',
                            link: "#",
                            isTransparent: false
                        },
                        {
                            name: 'FAQ',
                            link: "/faq",
                            isTransparent: true
                        },
                        {
                            name: 'Documentation',
                            link: "/documentation",
                            isTransparent: true
                        }
                    ]
                }}
            />
            <Statistic 
                items = {[
                    {
                        title: "All Time Volume",
                        value: "$100B"
                    },
                    {
                        title: "Total Donaters",
                        value: "11K"
                    },
                    {
                        title: "Daily Volume",
                        value: "$50K"
                    }
                ]}
            />
        </div>
    </div>
}

export default Main;