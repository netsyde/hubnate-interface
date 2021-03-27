import React, { useState, useEffect } from "react";
import { Header } from '@components/Main'
import { Container } from '@components/Pools'
import DonateModal from '@components/DonateModal'

const BNB = require('@images/logotypes/bnb.svg')
const UNI = require('@images/logotypes/uni.svg')

const poolList = [
    {
        name: 'BNB',
        logotype: BNB,
        totalDonated: 10000,
        chance: 3,
        yourDeposit: 24000,
        donaters: 37899,
        active: true
    },
    {
        name: 'UNI',
        logotype: UNI,
        totalDonated: 58000,
        chance: 0.25,
        yourDeposit: 3542,
        donaters: 1785,
        active: true
    },
    {
        name: 'BNB',
        logotype: BNB,
        totalDonated: 10000,
        chance: 3,
        yourDeposit: 24000,
        donaters: 37899,
        active: false
    },
    {
        name: 'UNI',
        logotype: UNI,
        totalDonated: 58000,
        chance: 0.25,
        yourDeposit: 3542,
        donaters: 1785,
        active: false
    },
    {
        name: 'BNB',
        logotype: BNB,
        totalDonated: 10000,
        chance: 3,
        yourDeposit: 24000,
        donaters: 37899,
        active: false
    },
    {
        name: 'UNI',
        logotype: UNI,
        totalDonated: 58000,
        chance: 0.25,
        yourDeposit: 3542,
        donaters: 1785,
        active: false
    },
    {
        name: 'BNB',
        logotype: BNB,
        totalDonated: 10000,
        chance: 3,
        yourDeposit: 24000,
        donaters: 37899,
        active: false
    },
    
]

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

const Pools = () => {
    type DonateModalState = boolean | 'initial'
    const [openDonateModal, setOpenDonateModal] = useState<DonateModalState>('initial');
    const [selectedPool, setSelectedPool] = useState<number>(0);

    const calcFade = (donateModalState: DonateModalState) => {
        switch (donateModalState) {
            case 'initial': 
            console.log('current null ')
            return ''
            case true: 
            console.log('current fadeIn')
            return 'fadeIn';
            case false: 
            console.log('current fadeout')
            return 'fadeOut'
        }
    }

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
                    items: menuItems
                }}
            />
            <div className = "pools">
                <div className = "donate-modal-wrapper">
                    <DonateModal 
                        fade = {calcFade(openDonateModal)}
                        pools = {poolList.filter((pool) => pool.active)}
                        selectedPool = {selectedPool}
                        setSelectedPool = {setSelectedPool}
                    />
                </div>
                <Container 
                    pools = {poolList}
                    openDonateModal = {openDonateModal}
                    setOpenDonateModal = {setOpenDonateModal}
                    setSelectedPool = {setSelectedPool}
                />
            </div>
        </div>
    </div>
}

export default Pools;