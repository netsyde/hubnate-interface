import React, { useState, useEffect, useRef, MouseEventHandler } from "react";
import { Main } from '@src/layouts'
import { Container } from '@components/Utility'
import DonateModal from '@components/DonateModal'
import { IPool } from '@src/types/Pools'
import { Button, Table } from '@components/Utility';
import { TableRow, TableRowTokenItem, TableRowItem, TableRowMetaItem, TableDetailsRowItem } from '@components/Utility/Table/components';
import poolList from '@src/data/pools';
import Head from 'next/head';
import useWindowSize from '@src/utils/useWindowSize';

const convertNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IExpandedRow {
    index: number,
    onClick: any,
    openDonateModal: any
}

const ExpandedRow = (props: IExpandedRow) => {
    return (
        <tr className = "row_expanded">
            <td>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Total Donated</p>
                    <p className = "table_meta-number">${convertNumber(poolList[props.index].totalDonated)}</p>
                </div>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Your Deposit</p>
                    <p className = "table_meta-number">${convertNumber(poolList[props.index].yourDeposit)}</p>
                </div>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Donaters</p>
                    <p className = "table_meta-number">{convertNumber(poolList[props.index].donaters)}</p>
                </div>
                <div className = "row_expanded__line row_expanded__line-center">
                    <Button 
                        name = "Donate"
                        type = {poolList[props.index].active ? 'default' : 'disabled'}
                        padding = "10px 100px"
                        onClick = {props.onClick}
                        className = {props.openDonateModal == true ? 'blocked-selection' : ''}
                    />
                </div>
            </td>
        </tr>
    )
}

const Pools = () => {
    type DonateModalState = boolean | 'initial'
    const [openDonateModal, setOpenDonateModal] = useState<DonateModalState>('initial');
    const [selectedPool, setSelectedPool] = useState<string>();
    const size = useWindowSize();
    const refs = poolList.map(() => useRef(null))
    const [fade, setFade] = useState<Fade>('')
    const [chevrons, setChevrons] = useState<boolean[]>(poolList.map(() => false))

    type Fade = 'fadeIn' | 'fadeOut' | ''

    const calcFade = (donateModalState: DonateModalState) => {
        switch (donateModalState) {
            case 'initial': 
            // console.log('current null ')
            return ''
            case true: 
            // console.log('current fadeIn')
            return 'fadeIn';
            case false: 
            // console.log('current fadeout')
            return 'fadeOut'
        }
    }

    const onClickDonate = (pool: IPool) => {
        console.log('open modal')
        setSelectedPool(pool.name)
        setFade(calcFade(true))
        
        setOpenDonateModal(true)
    }

    const closeDonatModal = () => {
        setFade(calcFade(false))
        // setOpenDonateModal(false) // сначала фейд потом убираем
        setTimeout(() => setOpenDonateModal(false), 700)
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

    const handleTableRowClick = (index: number) => {
        let newChevrons = chevrons.concat()
        newChevrons[index] = !newChevrons[index]
        setChevrons(newChevrons)
    }

    return (
        <>
            <Head>
                <title>Hubnate | Pools</title>
            </Head>
            <Main>
                {openDonateModal == true ?
                    <div className = "donate-modal-wrapper" onClick = {openDonateModal === true ? () => closeDonatModal() : null}>
                        <DonateModal 
                            fade = {fade}
                            pools = {poolList.filter((pool) => pool.active)}
                            selectedPool = {selectedPool}
                            setSelectedPool = {setSelectedPool}
                            // onClick = {onClickDonateModal}
                            // style = {openDonateModal == true ? {display: 'flex'} : {display: 'none'}}
                        />
                    </div> : null
                    }
                <div className = "pools">
                    <Container 
                        title = {"Pools"}
                        className = {calcShadow(openDonateModal)}
                        // onClick = {() => openDonateModal === true ? closeDonatModal() : null}
                        onClickElement = {() => onClickSettings()}
                    >
                        <Table>
                            {poolList.map((pool: IPool, index: number) => 
                                <React.Fragment key={index}>
                                    <TableRow
                                        key = {`row` + index}
                                        style = {pool.active ? null : {filter: "blur(5.2px)", userSelect: 'none'}}
                                        onClick = {isMobile(size.width) ? () => handleTableRowClick(index) : null}
                                        ref = {refs[index]}
                                    >
                                        <TableRowTokenItem 
                                            ticker = {pool.name}
                                            logo = {pool.logotype}
                                        />
                                        <TableRowMetaItem
                                            title = {"Chance"}
                                            value = {`${convertNumber(pool.chance)}`}
                                        />
                                        {isMobile(size.width) ? null : 
                                        <>
                                            <TableRowMetaItem
                                                title = {"Total donated"}
                                                value = {`$${convertNumber(pool.totalDonated)}`}
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
                                        </>
                                    }
                                    {isMobile(size.width) ? 
                                        <TableDetailsRowItem
                                            isOpen = {chevrons[index]}
                                        />
                                            : null
                                    }
                                    </TableRow>
                                    {chevrons[index] ?
                                        <ExpandedRow
                                            index = {index}
                                            onClick = {() => onClickDonate(poolList[index])}
                                            openDonateModal = {openDonateModal}
                                            key = {`expanded-` + index}
                                        /> : null
                                    }
                                </React.Fragment>
                                
                            )}
                            
                        </Table>
                    </Container>
                </div>
            </Main>
        </>
    )
}

export default Pools;