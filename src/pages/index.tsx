import React from "react";
import { Statistic, Description } from '../components/Main'
import { Main as MainLayout } from '@src/layouts'
import Head from 'next/head';

const Main = () => {

    return (
        <>
            <Head>
                <title>Hubnate</title>
            </Head>
            <MainLayout
                headerClassName = {'header-bgColorNone'}
                logoColor = {'white'}
                mobileMenuType = {'transparent'}
            >
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
        </>
    )
}

export default Main;