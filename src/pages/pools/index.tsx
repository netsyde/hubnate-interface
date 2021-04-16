import React, { useState, useEffect } from "react";
import { Main } from '@src/layouts';
import { Container } from '@components/Utility';
import DonateModal from '@components/DonateModal';
import { IPool } from '@src/types/Pools';
import { Button, Table } from '@components/Utility';
import { TableRow, TableRowTokenItem, TableRowItem, TableRowMetaItem } from '@components/Utility/Table/components';
import poolList from '@src/data/pools';
import Head from 'next/head';
import { useWindowSize, convertNumber } from '@src/utils';
import { Shadow, Fade } from '@src/types';
import { useModal } from '@src/widgets/Modal';

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IExpandedRow {
    index: number,
    onClick: any,
    openDonateModal?: any
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
                    />
                </div>
            </td>
        </tr>
    )
}

const Pools = () => {
    let [selectedPool, setSelectedPool] = useState<string>();
    const size = useWindowSize();
    const [chevrons, setChevrons] = useState<boolean[]>(poolList.map(() => false))

    let [onPresentDonateModal] = useModal(
        <DonateModal 
            pools = {poolList.filter((pool) => pool.active)}
            selectedPool = {selectedPool}
            setSelectedPool = {setSelectedPool}
        />
    )

    const onClickDonate = (pool: IPool) => {
        setSelectedPool(pool.name)
        onPresentDonateModal() // TODO: fix updating selectedPool ^
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
            <Main
            >
                <div className = "pools">
                    <Container 
                        title = {"Pools"}
                        onClickElement = {() => onClickSettings()}
                    >
                        <Table>
                            {poolList.map((pool: IPool, index: number) => 
                                <React.Fragment key={index}>
                                    <TableRow
                                        style = {pool.active ? null : {filter: "blur(5.2px)", userSelect: 'none'}}
                                        onClick = {isMobile(size.width) ? () => handleTableRowClick(index) : null}
                                        isMobile = {isMobile(size.width)}
                                        isOpen = {chevrons[index]}
                                    >
                                        <TableRowTokenItem 
                                            ticker = {pool.name}
                                            logo = {pool.logotype}
                                            displayOnMobile = {true}
                                        />
                                        <TableRowMetaItem
                                            title = {"Chance"}
                                            value = {`${convertNumber(pool.chance)}`}
                                            displayOnMobile = {true}
                                        />
                                        <TableRowMetaItem
                                            title = {"Total donated"}
                                            value = {`$${convertNumber(pool.totalDonated)}`}
                                            displayOnMobile = {!isMobile(size.width)}
                                        />  
                                        <TableRowMetaItem
                                            title = {"Your Deposit"}
                                            value = {`$${convertNumber(pool.totalDonated)}`}
                                            displayOnMobile = {!isMobile(size.width)}
                                        />
                                        <TableRowMetaItem
                                            title = {"Donaters"}
                                            value = {`${convertNumber(pool.donaters)}`}
                                            displayOnMobile = {!isMobile(size.width)}
                                        />
                                        <TableRowItem
                                            displayOnMobile = {!isMobile(size.width)}
                                        >
                                            <Button 
                                                name = "Donate"
                                                link = {`#${pool.name}`}
                                                type = {pool.active ? 'default' : 'disabled'}
                                                padding = "10px 100px"
                                                onClick = {pool.active ? () => onClickDonate(pool) : null}
                                            />
                                        </TableRowItem>
                                    </TableRow>
                                    {chevrons[index] && isMobile(size.width) ?
                                        <ExpandedRow
                                            index = {index}
                                            onClick = {() => onClickDonate(poolList[index])}
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