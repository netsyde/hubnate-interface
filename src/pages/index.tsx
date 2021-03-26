import React, { useState, useEffect } from "react";
import { Header, Statistic, Description } from '../components/Main'

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
                            name: "Pools",
                            link: '/pools',
                            isButton: false
                        },
                        {
                            name: "Chain",
                            link: '/chain',
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
                            type: 'default'
                        },
                        {
                            name: 'FAQ',
                            link: "/faq",
                            type: 'transparent'
                        },
                        {
                            name: 'Documentation',
                            link: "/documentation",
                            type: 'transparent'
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