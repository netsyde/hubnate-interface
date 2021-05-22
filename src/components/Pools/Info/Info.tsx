import React, { useState, useEffect } from "react";
import { IPool } from '@src/types/Pools';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import { useWeb3React } from '@web3-react/core';

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
    selectedPool: number,
    rootStore?: RootStore
}

const Info = inject("rootStore")(observer((props: IPoolsInfo) => {
    const [blinkTag, setBlinkTag] = useState<boolean>(false);
    const { account } = useWeb3React()
    const hubnateContract = useHubnate()

    useEffect(() => {
        const getSended = async () => {
            let userSended = await props.rootStore.user.getUserUnclaimDonates(hubnateContract, props.poolList[props.selectedPool].id, account)
            if (userSended && userSended.length > 0) {
                setBlinkTag(true)
            } else {
                setBlinkTag(false)
            }
        }
        getSended()
    }, [account, props.selectedPool])

    return (
        <div className="pools_info">
            <div className="pools_info__menu">
                <Link href={"/pools"}>
                    <a>
                        <p className="pools_info__menu-enabled">Information</p>
                    </a>
                </Link>
                <Link href={"/pools/claim"}>
                    <div className="pools_info__menu_upg">
                        <a>
                            <p>Claim</p>
                        </a>
                        {blinkTag && <div className="pools_info__menu_tag" />}
                    </div>
                </Link>
                <Link href={"/pools/history"}>
                    <a>
                        <p>History</p>
                    </a>
                </Link>
            </div>
            {<p className="pools_info__description">
                {props.poolList[props.selectedPool].token.description}
            </p>  || <Skeleton />}
            <div className="pools_info__stats">
                <div className="pools_info__stats_row">
                    <StatsBubble name = {"Distributed"} number = {props.poolList[props.selectedPool].totalDonated}/>
                    <StatsBubble name = {"Cost per Ticket"} number = {props.poolList[props.selectedPool].costPerTicket}/>
                    <StatsBubble name = {"HODL CT Value"} number = {props.poolList[props.selectedPool].userCThodlAmount}/>
                </div>
                <div className="pools_info__stats_row">
                    <div className="pools_info__stats_row-left">
                        <BigStatsBubble name = {"Chance, %"} number = {props.poolList[props.selectedPool].chance}/> {/* 362 = (single block + padding + margin-right + border) * 2 */}
                    </div>
                    <div className="pools_info__stats_row-right">
                        <StatsBubble name = {"Donated (your)"} number = {props.poolList[props.selectedPool].userDonated}/>
                        <StatsBubble name = {"Recieved (your)"} number = {props.poolList[props.selectedPool].userRecieved}/>
                    </div>
                </div>

            </div>
            
        </div>
    )
}))

export default Info;