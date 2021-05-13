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
import { useWeb3React } from '@web3-react/core';

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
    requestId: string,
    isTicketsClaim: boolean;
    isDistribution: boolean;
}

// const getTotalAmount = (donates: IDonate[]) => {
//     let total = 0;

//     for (let i = 0; i < donates.length; i++) {
//         let donate = donates[i];
//         total += donate.fiatEquivalent;
//     }
//     return total;
// }

interface ISended {
    data: any,
    rootStore: RootStore
}

interface IExpandedRow {
    index: number,
    donateList: IDonate[],
    claimTickets: any,
    openDonateModal?: any,
    claiming: boolean
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
                <div className = "row_expanded__line row_expanded__line-center">
                   {(!donate.isTicketsClaim && donate.isDistribution ) ? <Button 
                        name = {props.claiming ? 'Claiming...' : "Claim"}
                        type = {props.claiming ? 'disabled' : 'default'}
                        padding = "10px 100px"
                        onClick = {() => props.claimTickets(donate.donateId)}
                    /> : 
                    <Button 
                        name = {"Claimed"}
                        type = {'disabled'}
                        padding = "10px 89px"
                        // onClick = {() => props.claimTickets(donate.donateId)}
                    />
                    }
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

const Sended = inject("rootStore")(observer((props: ISended) => {
    const address = props.data.address;
    const size = useWindowSize();
    const [poolList, setPoolList] = useState<IPool[]>(poolsGap)
    const [sended, setSended] = useState<IDonate[]>([])
    const [chevrons, setChevrons] = useState<boolean[]>(sended.map(() => false))
    const donateContract = useHubnate()
    const [claiming, setClaiming] = useState<boolean>(false)
    const CTcontracts = poolList.map((pool) => useCT(pool.CT[4]))
    const [selectedPool, setSelectedPool] = useState<number>(0);
    let hubnate = useHubnate()
    const { account } = useWeb3React()

    useEffect(() => {
        const getSended = async () => {
            let userSended = await props.rootStore.user.getUserSended(donateContract, poolList[selectedPool].id, address)
            console.log('user sended', userSended)
            if (userSended) {
                setSended(userSended)
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
        getSended()
    }, [address, selectedPool, claiming]);

    const handleTableRowClick = (index: number) => {
        let newChevrons = chevrons.concat()
        newChevrons[index] = !newChevrons[index]
        setChevrons(newChevrons)
    }

    const claimTickets = async (donateId: number) => {
        console.log('donate donateId', donateId)
        setClaiming(true);
        // console.log(token)
        let claim = await hubnate.methods.claimTickets(
            poolsGap[selectedPool].id,
            donateId
        ).send({ from: account })

        if (claim) {
            setClaiming(false)
            console.log('successfully claim')
        }
    }

    if (address) {
        return (
            <>
                <Head>
                    <title>Hubnate | Account Sended</title>
                </Head>
                <Main>
                    <div className = "account">
                        <Container
                            className = {"account_container"}
                            title = {"Account Sended"}
                            address = {isMobile(size.width) ? minifyString(address) : address}
                        >
                            <div className = "account_main account_recieved">
                                <div className = "account_main__info">
                                    <PoolSelector 
                                        pools = {poolList}
                                        selectedPool = {selectedPool}
                                        setSelectedPool = {setSelectedPool}
                                    />
                                    <p className = {"account_text"}>Donates sended: {sended.length}</p>
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
                                {sended && sended.map((donate: IDonate, index: number) => 
                                    <React.Fragment key = {index}>
                                        <TableRow
                                            key = {index}
                                            onClick = {isMobile(size.width) ? () => handleTableRowClick(index) : null}
                                            isMobile = {isMobile(size.width)}
                                            isOpen = {chevrons[index]}
                                            // style = {(!donate.isTicketsClaim && donate.isDistribution ) ? {filter: "blur(5.2px)", userSelect: 'none'} : null}
                                        >
                                            <TableRowTokenItem 
                                                ticker = {poolList[selectedPool].token.name}
                                                logo = {poolList[selectedPool].token.logotype}
                                                displayOnMobile = {true}
                                            />
                                            <TableRowMetaItem
                                                title = {"Amount"}
                                                value = {metaAccountNumber(Number(donate.numberOfTickets)  * poolList[selectedPool].costPerTicket, address)}
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
                                            {(!donate.isTicketsClaim && donate.isDistribution ) ? 
                                                (<TableRowItem
                                                    displayOnMobile = {!isMobile(size.width)}
                                                >
                                                    <Button 
                                                        name = {claiming ? 'Claiming...' : "Claim"}
                                                        type = {claiming ? 'disabled' : 'default'}
                                                        padding = "10px 100px"
                                                        onClick = {() => claimTickets(donate.donateId)}
                                                    />
                                                </TableRowItem>) : 
                                                (<TableRowItem
                                                    displayOnMobile = {!isMobile(size.width)}
                                                >
                                                    <Button 
                                                        name = {"Claimed"}
                                                        type = {'disabled'}
                                                        padding = "10px 89px"
                                                    />
                                                </TableRowItem>)
                                            }
                                        </TableRow>
                                        {chevrons[index] && isMobile(size.width) ?
                                            <ExpandedRow
                                                index = {index}
                                                donateList = {sended}
                                                claiming = {claiming}
                                                claimTickets = {claimTickets}
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

export default Sended;