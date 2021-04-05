import React, { useState, useEffect } from "react";
import { Main } from '@src/layouts'
import { Container } from '@components/Utility'
import DonateModal from '@components/DonateModal'
import IPool from '@src/types/Pools/IPool'
import { Utility } from '@src/types'
import { Button, Table } from '@components/Utility';
import { TableRow, TableRowTokenItem, TableRowItem, TableRowMetaItem } from '@components/Utility/Table/components';
import { IButton } from "@src/types/Utility";
const BNB = require('@images/logotypes/bnb.png')
const UNI = require('@images/logotypes/uni.png')
const BUX = require('@images/logotypes/bux.png')

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
        name: 'BUX',
        logotype: BUX,
        totalDonated: 15892,
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

const convertNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const Pools = () => {
    type DonateModalState = boolean | 'initial'
    const [openDonateModal, setOpenDonateModal] = useState<DonateModalState>('initial');
    const [selectedPool, setSelectedPool] = useState<string>();

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

    const onClickDonate = (pool: IPool) => {
        setSelectedPool(pool.name)
        setOpenDonateModal(true)
    }

    const closeDonatModal = () => {
        setOpenDonateModal(false)
    }

    const calcShadow = (donateModalState: DonateModalState) => {
        switch (donateModalState) {
            case 'initial': return ''
            case true: return 'container-shadow';
            case false: return 'container-shadowOut'
        }
    }

    const onClickSettings = () => {
        alert('not implemented')
    }

    return (
        <Main>
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
                    title = {"Pools"}
                    className = {calcShadow(openDonateModal)}
                    onClick = {() => openDonateModal === true ? closeDonatModal() : null}
                    onClickElement = {() => onClickSettings()}
                >
                    <Table>
                        {poolList.map((pool: IPool, index: number) => 
                            <TableRow
                                key = {index}
                                style = {pool.active ? null : {filter: "blur(5.2px)", userSelect: 'none'}}
                            >
                                <TableRowTokenItem 
                                    ticker = {pool.name}
                                    logo = {pool.logotype}
                                />
                                <TableRowMetaItem
                                    title = {"Total donated"}
                                    value = {`$${convertNumber(pool.totalDonated)}`}
                                />
                                <TableRowMetaItem
                                    title = {"Chance"}
                                    value = {`${convertNumber(pool.chance)}`}
                                />
                                <TableRowMetaItem
                                    title = {"Your Deposit"}
                                    value = {`$${convertNumber(pool.totalDonated)}`}
                                />
                                <TableRowMetaItem
                                    title = {"Donaters"}
                                    value = {`${convertNumber(pool.donaters)}`}
                                />
                                <TableRowItem>
                                    <Button 
                                        name = "Donate"
                                        link = {`#${pool.name}`}
                                        type = {pool.active ? 'default' : 'disabled'}
                                        padding = "10px 100px"
                                        onClick = {pool.active ? () => onClickDonate(pool) : null}
                                        className = {openDonateModal == true ? 'blocked-selection' : ''}
                                    />
                                </TableRowItem>
                            </TableRow>
                        )}
                        
                    </Table>
                </Container>
            </div>
        </Main>
    )
}

export default Pools;