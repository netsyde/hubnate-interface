import React, { useState, useEffect } from "react";
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
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';
import poolsGap from '@src/data/constants/pools';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract';
import { PoolSelector } from '@components/Account';

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IPoolMinifyInfo {
    name: string,
    logotype: any
}

interface IDonate {
    donateId: number,
    donater: string,
    numberOfTickets: number,
    requestId: string
}

// const getTotalAmount = (donates: IDonate[]) => {
//     let total = 0;

//     for (let i = 0; i < donates.length; i++) {
//         let donate = donates[i];
//         total += donate.fiatEquivalent;
//     }
//     return total;
// }

interface IRecieved {
    data: any,
    rootStore: RootStore
}

interface IExpandedRow {
    index: number,
    donateList: IDonate[],
}

const ExpandedRow = (props: IExpandedRow) => {
    let donate = props.donateList[props.index];
    return (
        <tr className = "row_expanded">
            <td>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Donater</p>
                    <p className = "table_meta-number">{minifyString(donate.donater)}</p>
                </div>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Request Id</p>
                    <p className = "table_meta-number">{minifyString(donate.requestId)}</p>
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

const Recieved = inject("rootStore")(observer((props: IRecieved) => {
    const address = props.data.address;
    const size = useWindowSize();
    const [poolList, setPoolList] = useState<IPool[]>(poolsGap)
    const [recieved, setRecieved] = useState<IDonate[]>([])
    const [chevrons, setChevrons] = useState<boolean[]>(recieved.map(() => false))
    const donateContract = useHubnate()
    const CTcontracts = poolList.map((pool) => useCT(pool.CT[4]))
    const [selectedPool, setSelectedPool] = useState<number>(0);

    useEffect(() => {
        const getRecieved = async () => {
            let userRecieved = await props.rootStore.user.getUserRecieved(donateContract, poolList[selectedPool].id, address)
            console.log('user recieved', userRecieved)
            if (userRecieved) {
                setRecieved(userRecieved)
            }
        }
        const getPoolList = async () => {
            let fetchPoolList =  await props.rootStore.user.getPools(donateContract, CTcontracts, address) || poolsGap;
            console.log(fetchPoolList)
            if (fetchPoolList) {
                setPoolList(fetchPoolList)
            }
        }
        
        getPoolList()
        // getPoolList()
        getRecieved()
    }, [address, selectedPool]);

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
                                    <PoolSelector 
                                        pools = {poolList}
                                        selectedPool = {selectedPool}
                                        setSelectedPool = {setSelectedPool}
                                    />
                                    <p className = {"account_text"}>Donates recieved: {recieved.length}</p>
                                </div>
                                <div className = "account_main__buttons">
                                    <Button 
                                        name = "Sended"
                                        link = {`/account/${address}/sended`}
                                        type = {'default'}
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
                                {recieved && recieved.map((donate: IDonate, index: number) => 
                                    <React.Fragment key = {index}>
                                        <TableRow
                                            key = {index}
                                            onClick = {isMobile(size.width) ? () => handleTableRowClick(index) : null}
                                            isMobile = {isMobile(size.width)}
                                            isOpen = {chevrons[index]}
                                        >
                                            <TableRowTokenItem 
                                                ticker = {poolList[selectedPool].token.name}
                                                logo = {poolList[selectedPool].token.logotype}
                                                displayOnMobile = {true}
                                            />
                                            <TableRowMetaItem
                                                title = {"Amount"}
                                                value = {metaAccountNumber(Number(donate.numberOfTickets) * poolList[selectedPool].costPerTicket, address)}
                                                displayOnMobile = {true}
                                            />
                                            <TableRowMetaItem
                                                title = {"Donater"}
                                                value = {minifyString(donate.donater)}
                                                displayOnMobile = {!isMobile(size.width)}
                                            />
                                            <TableRowMetaItem
                                                title = {"Request Id"}
                                                value = {`${minifyString(donate.requestId)}`}
                                                displayOnMobile = {!isMobile(size.width)}
                                            />
                                            {/* <TableRowItem
                                                displayOnMobile = {!isMobile(size.width)}
                                            >
                                                <Button 
                                                    name = "View"
                                                    link = {`https://bscscan.com/tx/${donate.txHash}`}
                                                    type = {'default'}
                                                    padding = "10px 100px"
                                                />
                                            </TableRowItem> */}
                                        </TableRow>
                                        {chevrons[index] && isMobile(size.width) ?
                                            <ExpandedRow
                                                index = {index}
                                                donateList = {recieved}
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
}))

export const getServerSideProps = async (contex: any) => {
    const data = {
        address: contex.query.address
    }
    return { props: { data } }
}

export default Recieved;