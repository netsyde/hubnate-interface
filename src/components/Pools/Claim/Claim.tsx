import React, { useState, useEffect } from "react";
import { IPool } from '@src/types/Pools';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import { useWeb3React } from '@web3-react/core';
import { Button, Table } from '@components/Utility'
import { TableRow, TableRowTokenItem, TableRowItem, TableRowMetaItem } from '@components/Utility/Table/components';
import { minifyString, convertNumber, useWindowSize } from '@src/utils';

interface IPoolsInfo {
    poolList: IPool[],
    selectedPool: number,
    rootStore?: RootStore
}

interface IDonate {
    donateId: number,
    donater: string,
    numberOfTickets: number,
    requestId: string,
    isTicketsClaim: boolean;
    isDistribution: boolean;
}

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

const metaAccountNumber = (number: number, account: string) => {
    try {
        return typeof(number) == 'number' && (account ? `${convertNumber(number)}` : `locked`) || <Skeleton/>
    } catch (e) {
        return <Skeleton/>
    }
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

const Claim = inject("rootStore")(observer((props: IPoolsInfo) => {
    const [blinkTag, setBlinkTag] = useState<boolean>(false);
    const [sended, setSended] = useState<IDonate[]>([]);
    const { account } = useWeb3React()
    const hubnateContract = useHubnate()
    const [chevrons, setChevrons] = useState<boolean[]>(sended.map(() => false))
    const [claiming, setClaiming] = useState<boolean>(false)

    const size = useWindowSize();
    useEffect(() => {
        const getSended = async () => {
            let userSended = await props.rootStore.user.getUserUnclaimDonates(hubnateContract, props.poolList[props.selectedPool].id, account)
            if (userSended && userSended.length > 0) {
                setBlinkTag(true)
            } else {
                setBlinkTag(false)
            }

            if (userSended) {
                setSended(userSended)
            }
        }
        getSended()
    }, [account, props.selectedPool, claiming])

    const handleTableRowClick = (index: number) => {
        let newChevrons = chevrons.concat()
        newChevrons[index] = !newChevrons[index]
        setChevrons(newChevrons)
    }

    const claimTickets = async (donateId: number) => {
        console.log('donate donateId', donateId)
        setClaiming(true);
        // console.log(token)
        let claim = await hubnateContract.methods.claimTickets(
            props.poolList[props.selectedPool].id,
            donateId
        ).send({ from: account })

        if (claim) {
            setClaiming(false)
            console.log('successfully claim')
        }
    }

    return (
        <div className="pools_info">
            <div className="pools_info__menu">
                <Link href={"/app"}>
                    <a>
                        <p>Information</p>
                    </a>
                </Link>
                <Link href={"/app/claim"}>
                    <div className="pools_info__menu_upg">
                        <a>
                            <p className="pools_info__menu-enabled">Claim</p>
                        </a>
                        {blinkTag && <div className="pools_info__menu_tag" />}
                    </div>
                </Link>
                <Link href={"/app/history"}>
                    <a>
                        <p>History</p>
                    </a>
                </Link>
            </div>
            <Table className="pools_table">
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
                                ticker = {props.poolList[props.selectedPool].token.name + " CT"}
                                logo = {props.poolList[props.selectedPool].token.logotype}
                                displayOnMobile = {true}
                            />
                            <TableRowMetaItem
                                title = {"Amount"}
                                value = {metaAccountNumber(Number(donate.numberOfTickets)  * props.poolList[props.selectedPool].costPerTicket, account)}
                                displayOnMobile = {true}
                            />
                            <TableRowMetaItem
                                title = {"Request Id"}
                                value = {`${minifyString(donate.requestId)}`}
                                displayOnMobile = {!isMobile(size.width)}
                            />
                            <TableRowItem
                                displayOnMobile = {!isMobile(size.width)}
                            >
                                <Button 
                                    name = {claiming ? 'Claiming...' : "Claim"}
                                    type = {claiming ? 'disabled' : 'default'}
                                    padding = "10px 100px"
                                    onClick = {() => claimTickets(donate.donateId)}
                                />
                            </TableRowItem>
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
            
        </div>
    )
}))

export default Claim;