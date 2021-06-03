import { Selector, StatsItem, Donate, Claim } from './components';
import { Button } from '@components/Utility';
import React, { useState, useEffect } from "react";
import { IPool } from '@src/types/Pools';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import ConnectModal from '@components/ConnectModal';
import { useModal } from '@src/widgets/Modal';
import useAuth from '@src/hooks/useAuth';
import { RootStore } from '@src/store/RootStore';
import { inject, observer } from "mobx-react";
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next'
const sync = require('@images/ui/sync-solid.svg')
import { useSnackbar } from '@src/widgets/Snackbar'


interface IPoolsPanel {
     poolList: IPool[],
     rootStore?: RootStore
}

type IPanelRoute = 'donate' | 'claim' | 'exchange'

interface IPanelRouteItem {
    isRoute: boolean,
    onClickRoute: (id: IPanelRoute) => any,
    id: IPanelRoute,
    name: string

}
const PanelRouteItem = (props: IPanelRouteItem) => {
    if (props.isRoute) {
        return (
            <p className="pools_panel__menu_route-enabled" onClick = {() => props.onClickRoute(props.id)}>{props.name}</p>
        )
    } else {
        return (
            <p onClick = {() => props.onClickRoute(props.id)}>{props.name}</p>
        )
        
    }
}

const Panel = inject("rootStore")(observer((props: IPoolsPanel) => {
    const { t } = useTranslation()
    const { addAlert } = useSnackbar() 
    const [route, setRoute] = useState<IPanelRoute>('donate');
    useEffect(() => {
        try {
            const getAutoUpdate = async () => {
                try {
                    let autoUpdate = window.localStorage.getItem("autoUpdate")

                    if (autoUpdate) {
                        // console.log('auto upd', JSON.parse(autoUpdate))
                        props.rootStore.user.setAutoUpdate(JSON.parse(autoUpdate))
                        if (JSON.parse(autoUpdate)) {
                            props.rootStore.user.setAutoUpdateObserver()
                        }
                    }
                } catch (e) {
                    console.log(e)
                    addAlert(e.message)
                }
            }

            getAutoUpdate()
        } catch (e) {
            console.log(e);
            addAlert(t('errors.getAutoUpdate'))
        }
    }, [props.rootStore.user.autoUpdate])

    const onClickSync = () => {
        try {
            const currentAutoUpdate = window.localStorage.getItem("autoUpdate")
            let newAutoUpdate = !JSON.parse(currentAutoUpdate)
            window.localStorage.setItem("autoUpdate", newAutoUpdate.toString());
            props.rootStore.user.setAutoUpdate(newAutoUpdate)
        } catch (e) {
            window.localStorage.setItem("autoUpdate", 'false');
            props.rootStore.user.setAutoUpdate(false)
            console.log(e)
            addAlert(e.message)
        }
    }

    const onClickSettings = () => {
        alert('not implemented')
    }

    const onClickRoute = (id: IPanelRoute) => {
        setRoute(id)
    }

    return (
        <div className="pools_panel">
            <div className="pools_panel__menu">
                <div className="pools_panel__menu_route">
                    <PanelRouteItem 
                        isRoute={route == 'donate'}
                        onClickRoute={onClickRoute}
                        id={'donate'}
                        name={t("panel.labels.donate")}
                    />
                    <PanelRouteItem 
                        isRoute={route == 'claim'}
                        onClickRoute={onClickRoute}
                        id={'claim'}
                        name={t("panel.labels.claim")}
                    />
                </div>
                <div className="pools_panel__menu_control">
                    {/* {/* <div className="pools_panel__menu_control__box">

                    </div> */}
                    <div 
                        className={
                            props.rootStore.user.autoUpdate ? 
                                "pools_panel__menu_control__box"
                                :
                                "pools_panel__menu_control__box pools_panel__menu_control__box-disabled"
                            }
                        onClick = {onClickSync}
                    >
                        <img src={sync} alt="sync" />
                    </div>
                </div>
            </div>
            {route == 'donate' ? <Donate poolList = {props.poolList}/> : <Claim poolList = {props.poolList}/>}
        </div>
    )
}))

export default Panel;