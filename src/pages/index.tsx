import React, { useState, useEffect } from "react";
import { Header, Statistic, Description } from '../components/Main'
import { Main as MainLayout } from '@src/layouts'

const Main = () => {
    return (
        <MainLayout>
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
        </MainLayout>
    )
}

export default Main;