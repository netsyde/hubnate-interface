import React, { useState, useEffect } from "react";
import { Header } from '@components/Main'
import { Container } from '@components/Pools'

const BNB = require('@images/logotypes/bnb.svg')
const UNI = require('@images/logotypes/uni.svg')

const Pools = () => {
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
            <div className = "pools">
                <Container 
                pools = {
                    [
                        {
                            name: 'BNB',
                            logotype: BNB,
                            totalDonated: 10000,
                            chance: 3,
                            yourDeposit: 24000,
                            donaters: 37899
                        },
                        {
                            name: 'UNI',
                            logotype: UNI,
                            totalDonated: 58000,
                            chance: 0.25,
                            yourDeposit: 3542,
                            donaters: 1785
                        },
                    ]
                }/>
            </div>
        </div>
    </div>
}

export default Pools;