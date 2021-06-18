import React, { useState, useEffect } from "react";
import { IPool } from '@src/types/Pools';
import Link from 'next/link';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import { useWeb3React } from '@web3-react/core';
import { useSnackbar } from '@src/widgets/Snackbar'
import { useTranslation } from 'next-i18next'
import { TableRow, TableRowTokenItem, TableRowItem, TableRowMetaItem } from '@components/Utility/Table/components';
import { Button, Table } from '@components/Utility'
import { minifyString, convertNumber, useWindowSize } from '@src/utils';
import Skeleton from 'react-loading-skeleton';

interface IPoolsInfo {
    poolList: IPool[],
    rootStore?: RootStore
}

interface IDonate {
    donateId: number,
    donater: string,
    reciever: string,
    numberOfTickets: number,
    requestId: string,
    isTicketsClaim: boolean;
    isDistribution: boolean;
}

const isMobile = (width: number) => {
    if (width <= 1200) return true
    return false;
}

interface IExpandedRow {
    index: number,
    donateList: IDonate[]
}

const metaAccountNumber = (number: number, account: string) => {
    try {
        return typeof(number) == 'number' && (account ? `${convertNumber(number)}` : `locked`) || <Skeleton/>
    } catch (e) {
        return <Skeleton/>
    }
}

const ExpandedRow = (props: IExpandedRow) => {
    let donate = props.donateList[props.index];
    const { t } = useTranslation()
    return (
        <tr className = "row_expanded">
            <td>
                <div className = "row_expanded__line">
                    <p className = "table_meta">{t("history.requestID")}</p>
                    <p className = "table_meta-number">{minifyString(donate.requestId)}</p>
                </div>
            </td>
        </tr>
    )
}


const History = inject("rootStore")(observer((props: IPoolsInfo) => {
    const { account } = useWeb3React()
    const hubnateContract = useHubnate()
    const { t } = useTranslation()
    const { addAlert } = useSnackbar() 
    const [donates, setDonates] = useState<IDonate[]>([]);
    const [chevrons, setChevrons] = useState<boolean[]>(donates.map(() => false))
    const size = useWindowSize();

    const handleTableRowClick = (index: number) => {
        try {
            let newChevrons = chevrons.concat()
            newChevrons[index] = !newChevrons[index]
            setChevrons(newChevrons)
        } catch (e) {
            console.log(e)
            addAlert(e.message)
        }
    }
    
    useEffect(() => {
        try {
            let getDonates = async () => {
                console.log('teg donates ids')
                let donatesAmount = await props.poolList[props.rootStore.user.selectedPool].donateAmount
                console.log('donate amount ', donatesAmount)
                // let ids = props.rootStore.user.getLastDonateIds(props.poolList[props.rootStore.user.selectedPool].donateAmount, 2)
                let donates = await props.rootStore.user.getUserSended(hubnateContract, 1, account)
                console.log(donates)
                if (donates) {
                    setDonates(donates)
                }
            }
            getDonates()
        } catch (e) {
            console.log(e)
        }
    }, []);

    return (
        <div className="pools_info">
            <div className="pools_info__menu">
                <Link href={"/"}>
                    <a>
                        <p>
                            {t("info.labels.information")}
                        </p>
                    </a>
                </Link>
                <Link href={"/history"}>
                    <a>
                        <p className="pools_info__menu_last pools_info__menu-enabled">
                            {t("info.labels.history")}
                        </p>
                    </a>
                </Link>
            </div>
            <Table className="pools_table">
                {donates && donates.map((donate: IDonate, index: number) => 
                    <React.Fragment key = {index}>
                        <TableRow
                            key = {index}
                            onClick = {isMobile(size.width) ? () => handleTableRowClick(index) : null}
                            isMobile = {isMobile(size.width)}
                            isOpen = {chevrons[index]}
                        >
                            <TableRowTokenItem 
                                ticker = {props.poolList[props.rootStore.user.selectedPool].token.name}
                                logo = {props.poolList[props.rootStore.user.selectedPool].token.logotype}
                                displayOnMobile = {true}
                            />
                            <TableRowMetaItem
                                title = {t("history.amount")}
                                value = {metaAccountNumber(Number(donate.numberOfTickets)  * props.poolList[props.rootStore.user.selectedPool].costPerTicket, account)}
                                displayOnMobile = {true}
                            />
                            <TableRowMetaItem
                                title = {t("history.donater")}
                                value = {
                                    <Link href={`https://rinkeby.etherscan.io/address/${donate.donater}`}>
                                        <a target="_blank">
                                            {donate.donater == account ? t("history.your") : minifyString(donate.donater)}
                                        </a>
                                    </Link>
                                }
                                displayOnMobile = {!isMobile(size.width)}
                            />
                            <TableRowMetaItem
                                title = {t("history.reciever")}
                                value = {
                                    <Link href={`https://rinkeby.etherscan.io/address/${donate.reciever}`}>
                                        <a target="_blank">
                                            {donate.reciever == account ? t("history.your") : minifyString(donate.reciever)}
                                        </a>
                                    </Link>
                                }
                                displayOnMobile = {!isMobile(size.width)}
                            />
                            <TableRowMetaItem
                                title = {t("history.requestID")}
                                value = {`${minifyString(donate.requestId)}`}
                                displayOnMobile = {!isMobile(size.width)}
                            />
                        </TableRow>
                        {chevrons[index] && isMobile(size.width) ?
                            <ExpandedRow
                                index = {index}
                                donateList = {donates}
                            /> : null
                        }
                        
                    </React.Fragment>
                )}
            </Table>
        </div>
    )
}))

export default History;