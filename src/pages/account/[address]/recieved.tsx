import React, { useState } from "react";
import { Main } from '@src/layouts'
import { Container } from '@components/Utility'
import { Button, Table } from '@components/Utility'
import { TableRow, TableRowTokenItem, TableRowItem, TableRowMetaItem } from '@components/Utility/Table/components';
import recivedDonates from '@src/data/donates'
import { IPool } from '@src/types/Pools';
import donates from '@src/data/donates';
import Head from 'next/head';
import { minifyString, convertNumber, useWindowSize } from '@src/utils';
import Skeleton from 'react-loading-skeleton';

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IPoolMinifyInfo {
    name: string,
    logotype: any
}

interface IDonate {
    pool: IPoolMinifyInfo,
    txHash: string,
    amount: number,
    donater: string,
    fiatEquivalent: number,
    winTicket: number
}

const getTotalAmount = (donates: IDonate[]) => {
    let total = 0;

    for (let i = 0; i < donates.length; i++) {
        let donate = donates[i];
        total += donate.fiatEquivalent;
    }
    return total;
}

interface IRecieved {
    data: any
}

interface IExpandedRow {
    index: number,
    link: string,
}

const ExpandedRow = (props: IExpandedRow) => {
    return (
        <tr className = "row_expanded">
            <td>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Donater</p>
                    <p className = "table_meta-number">{minifyString(donates[props.index].donater)}</p>
                </div>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Fiat Equivalent</p>
                    <p className = "table_meta-number">${convertNumber(donates[props.index].fiatEquivalent)}</p>
                </div>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Win Ticket</p>
                    <p className = "table_meta-number">{convertNumber(donates[props.index].winTicket)}</p>
                </div>
                <div className = "row_expanded__line row_expanded__line-center">
                    <Button 
                        name = "View"
                        type = {'default'}
                        padding = "10px 100px"
                        link = {props.link}
                    />
                </div>
            </td>
        </tr>
    )
}

const metaAccountNumber = (number: number, account: string) => {
    try {
        return typeof(number) == 'number' && (account ? `${convertNumber(number)}` : `locked`) || <Skeleton/>
    } catch (e) {
        return <Skeleton/>
    }
}

const Recieved = (props: IRecieved) => {
    const address = props.data.address;
    const size = useWindowSize();
    const [chevrons, setChevrons] = useState<boolean[]>(donates.map(() => false))

    const handleTableRowClick = (index: number) => {
        let newChevrons = chevrons.concat()
        newChevrons[index] = !newChevrons[index]
        setChevrons(newChevrons)
    }

    if (address) {
        return (
            <>
                <Head>
                    <title>Hubnate | Account Recieved</title>
                </Head>
                <Main>
                    <div className = "account">
                        <Container
                            className = {"account_container"}
                            title = {"Account Recieved"}
                            address = {isMobile(size.width) ? minifyString(address) : address}
                        >
                            <div className = "account_main account_recieved">
                                <div className = "account_main__info">
                                    <p className = {"account_text"}>Donates recieved: {donates.length}</p>
                                    <p className = {"account_text"}>Fiat equivalent: {convertNumber( getTotalAmount(donates) )}</p>
                                </div>
                                <div className = "account_main__buttons">
                                    <Button 
                                        name = "Sended"
                                        link = {`/account/${address}/sended`}
                                        type = {'disabled'}
                                        padding = "10px 20px"
                                        className = {"mr10"}
                                        
                                    />
                                    <Button 
                                        name = "Back"
                                        link = {`/account/${address}`}
                                        type = {'default'}
                                        padding = "10px 20px"
                                    />
                                </div>
                            </div>
                            <Table>
                                {recivedDonates.map((donate: IDonate, index: number) => 
                                    <React.Fragment key = {index}>
                                        <TableRow
                                            key = {index}
                                            onClick = {isMobile(size.width) ? () => handleTableRowClick(index) : null}
                                            isMobile = {isMobile(size.width)}
                                            isOpen = {chevrons[index]}
                                        >
                                            <TableRowTokenItem 
                                                ticker = {donate.pool.name}
                                                logo = {donate.pool.logotype}
                                                displayOnMobile = {true}
                                            />
                                            <TableRowMetaItem
                                                title = {"Amount"}
                                                value = {metaAccountNumber(donate.amount, address)}
                                                displayOnMobile = {true}
                                            />
                                            <TableRowMetaItem
                                                title = {"Donater"}
                                                value = {donate.donater}
                                                displayOnMobile = {!isMobile(size.width)}
                                            />
                                            <TableRowMetaItem
                                                title = {"Fiat Equivalent"}
                                                value = {`$${metaAccountNumber(donate.fiatEquivalent, address)}`}
                                                displayOnMobile = {!isMobile(size.width)}
                                            />
                                            <TableRowMetaItem
                                                title = {"Win Ticket"}
                                                value = {metaAccountNumber(donate.winTicket, address)}
                                                displayOnMobile = {!isMobile(size.width)}
                                            />
                                            <TableRowItem
                                                displayOnMobile = {!isMobile(size.width)}
                                            >
                                                <Button 
                                                    name = "View"
                                                    link = {`https://bscscan.com/tx/${donate.txHash}`}
                                                    type = {'default'}
                                                    padding = "10px 100px"
                                                />
                                            </TableRowItem>
                                        </TableRow>
                                        {chevrons[index] && isMobile(size.width) ?
                                            <ExpandedRow
                                                index = {index}
                                                link = {`https://bscscan.com/tx/${donate.txHash}`}
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
    } else {
        return null
    }
}

export const getServerSideProps = async (contex: any) => {
    const data = {
        address: contex.query.address
    }
    return { props: { data } }
}

export default Recieved;