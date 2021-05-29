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
import { useTranslation } from 'next-i18next'
import { useSnackbar } from '@src/widgets/Snackbar'
let noSuchCt = require('@src/images/ui/no-such-ct.svg')

interface IPoolsInfo {
    poolList: IPool[],
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
    if (width <= 1200) return true
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
    const { t } = useTranslation()
    return (
        <tr className = "row_expanded">
            <td>
                <div className = "row_expanded__line">
                    <p className = "table_meta">{t("claim.table.requestID")}</p>
                    <p className = "table_meta-number">{minifyString(donate.requestId)}</p>
                </div>
                <div className = "row_expanded__line row_expanded__line-center">
                   {(!donate.isTicketsClaim && donate.isDistribution ) ? <Button 
                         name = {props.claiming ? t("claim.buttons.claiming") : t("claim.buttons.claim")}
                        type = {props.claiming ? 'disabled' : 'default'}
                        padding = "10px 100px"
                        onClick = {() => props.claimTickets(donate.donateId)}
                    /> : 
                    <Button 
                        name = {"Claimed"}
                        type = {'disabled'}
                        padding = "10px 89px"
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
    const { t } = useTranslation()
    const { addAlert } = useSnackbar() 
    const size = useWindowSize();
    useEffect(() => {
        try {
            const getSended = async () => {
                let userSended = await props.rootStore.user.getUserUnclaimDonates(hubnateContract, props.poolList[props.rootStore.user.selectedPool].id, account)
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
        } catch (e) {
            console.log(e)
            addAlert(t('errors.getSended'))
        }
    }, [account, props.rootStore.user.selectedPool, claiming, props.rootStore.user.autoUpdateObserver])

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

    const claimTickets = async (donateId: number) => {
        try {
            setClaiming(true);
            let claim = await hubnateContract.methods.claimTickets(
                props.poolList[props.rootStore.user.selectedPool].id,
                donateId
            ).send({ from: account })

            if (claim) {
                setClaiming(false)
                addAlert(t('txs.claim'))
            }
        } catch (e) {
            console.log(e)
            addAlert(t('errors.claimTickets'))
        }
    }

    return (
        <div className="pools_info">
            <div className="pools_info__menu">
                <Link href={"/"}>
                    <a>
                        <p>{t("info.labels.information")}</p>
                    </a>
                </Link>
                <Link href={"/claim"}>
                    <div className="pools_info__menu_upg">
                        <a>
                            <p className="pools_info__menu-enabled">
                                {t("info.labels.claim")}
                            </p>
                        </a>
                        {blinkTag && <div className="pools_info__menu_tag" />}
                    </div>
                </Link>
                <Link href={"/history"}>
                    <a>
                        <p className="pools_info__menu_last">{t("info.labels.history")}</p>
                    </a>
                </Link>
            </div>

            {sended.length > 0 ? <Table className="pools_table">
                {sended && sended.map((donate: IDonate, index: number) => 
                    <React.Fragment key = {index}>
                        <TableRow
                            key = {index}
                            onClick = {isMobile(size.width) ? () => handleTableRowClick(index) : null}
                            isMobile = {isMobile(size.width)}
                            isOpen = {chevrons[index]}
                        >
                            <TableRowTokenItem 
                                ticker = {props.poolList[props.rootStore.user.selectedPool].token.name + " CT"}
                                logo = {props.poolList[props.rootStore.user.selectedPool].token.logotype}
                                displayOnMobile = {true}
                            />
                            <TableRowMetaItem
                                title = {t("claim.table.amount")}
                                value = {metaAccountNumber(Number(donate.numberOfTickets)  * props.poolList[props.rootStore.user.selectedPool].costPerTicket, account)}
                                displayOnMobile = {true}
                            />
                            <TableRowMetaItem
                                title = {t("claim.table.requestID")}
                                value = {`${minifyString(donate.requestId)}`}
                                displayOnMobile = {!isMobile(size.width)}
                            />
                            <TableRowItem
                                displayOnMobile = {!isMobile(size.width)}
                            >
                                <Button 
                                    name = {claiming ? t("claim.buttons.claiming") : t("claim.buttons.claim")}
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
            </Table> :
                <div className="pools_table_empty">
                    <img src={noSuchCt} alt="no-such-ct" />
                </div>
            }
            
        </div>
    )
}))

export default Claim;