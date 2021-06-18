import React, { useState, useEffect } from "react";
import { IPool } from '@src/types/Pools';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import { useWeb3React } from '@web3-react/core';
import { useSnackbar } from '@src/widgets/Snackbar'
import { useTranslation } from 'next-i18next'


interface IStatsBubble {
    name: string,
    number: number,
    width?: number
}

const StatsBubble = (props: IStatsBubble) => {
    return (
        <div className="statsBubble" style={{width: props.width}}>
            <p className="statsBubble_name">{props.name || <Skeleton />}</p>
            <p className="statsBubble_number">{typeof(props.number) == 'number' ? props.number : <Skeleton />}</p>
        </div>
    )
}

const BigStatsBubble = (props: IStatsBubble) => {
    return (
        <div className="statsBubble statsBubble-big" style={{width: props.width}}>
            <p className="statsBubble_name">{props.name || <Skeleton />}</p>
            <p className="statsBubble_number-big">{typeof(props.number) == 'number' ? props.number : <Skeleton />}</p>
        </div>
    )
}

interface IPoolsInfo {
    poolList: IPool[],
    rootStore?: RootStore
}

const Info = inject("rootStore")(observer((props: IPoolsInfo) => {
    const [blinkTag, setBlinkTag] = useState<boolean>(false);
    const { account } = useWeb3React()
    const hubnateContract = useHubnate()
    const { t } = useTranslation()
    const { addAlert } = useSnackbar() 

    useEffect(() => {
        try {
            const getSended = async () => {
                if (account) {
                    let userSended = await props.rootStore.user.getUserUnclaimDonates(hubnateContract, props.poolList[props.rootStore.user.selectedPool].id, account)
                    if (userSended) {
                        if (userSended.length > 0) {
                            setBlinkTag(true)
                        }
                    } else {
                        setBlinkTag(false)
                    }
                }
            }
            getSended()
        } catch (e) {
            console.log(e)
            addAlert(e.message)
    }
    }, [account, props.rootStore.user.selectedPool, props.rootStore.user.autoUpdateObserver])

    return (
        <div className="pools_info">
            {/* <div className="pools_info__menu">
                <Link href={"/"}>
                    <a>
                        <p className="pools_info__menu-enabled">
                            {t("info.labels.information")}
                        </p>
                    </a>
                </Link>
                <Link href={"/history"}>
                    <a>
                        <p className="pools_info__menu_last">
                            {t("info.labels.history")}
                        </p>
                    </a>
                </Link>
            </div> */}
            {<p className="pools_info__description">
                {props.poolList[props.rootStore.user.selectedPool].token.description}
            </p>  || <Skeleton />}
            <div className="pools_info__stats">
                <div className="pools_info__stats_row">
                    <StatsBubble name = {t("info.stats.distributed")} number = {props.poolList[props.rootStore.user.selectedPool].totalDonated}/>
                    <StatsBubble name = {t("info.stats.costPerTicket")} number = {props.poolList[props.rootStore.user.selectedPool].costPerTicket}/>
                    <StatsBubble name = {t("info.stats.hodlCtValue")} number = {props.poolList[props.rootStore.user.selectedPool].userCThodlAmount}/>
                </div>
                <div className="pools_info__stats_row" id="stats_row_second">
                    <div className="pools_info__stats_row-left">
                        <BigStatsBubble name = {t("info.stats.chance")} number = {props.poolList[props.rootStore.user.selectedPool].chance}/>
                    </div>
                    <div className="pools_info__stats_row-right">
                        <StatsBubble name = {t("info.stats.donated")} number = {props.poolList[props.rootStore.user.selectedPool].userDonated}/>
                        <StatsBubble name = {t("info.stats.recieved")} number = {props.poolList[props.rootStore.user.selectedPool].userRecieved}/>
                    </div>
                </div>

            </div>
            
        </div>
    )
}))

export default Info;