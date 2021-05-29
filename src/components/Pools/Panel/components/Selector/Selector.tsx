import React, { useState, useEffect } from "react";
import { useWeb3React } from '@web3-react/core';
import { IPool } from '@src/types/Pools';
import { useERC20 } from '@src/hooks/useContract'
import { fixNumber } from '@src/utils';
import { RootStore } from '@src/store/RootStore';
import { inject, observer } from "mobx-react";
const chevron = require('@images/ui/chevron-right.svg')
import { useSnackbar } from '@src/widgets/Snackbar'
import { useTranslation } from 'next-i18next'

interface ISelector {
    poolList: IPool[],
    rootStore?: RootStore
}

const Selector = inject("rootStore")(observer((props: ISelector) => {
    const [expanded, setExpanded] = useState<boolean>(false)
    const [balances, setBalances] = useState<number[]>([])
    const { account } = useWeb3React()
    const { addAlert } = useSnackbar() 
    const { t } = useTranslation()

    const onClickInput = async () => {
        setExpanded(!expanded)
    }

    const onClickItem = (index: number) => {
        try {
            props.rootStore.user.setSelectedPool(index)
            setExpanded(false)
        } catch (e) {
            console.log(e)
            addAlert(e.message)
        }
    }
    let tokens = props.poolList.map((pool, index) => useERC20(props.poolList[index].token.address[4]))
    

    useEffect(() => {
        try {
            const getUserTokenBalances = async () => {
                if (!account) return;
                let balances = []
                for (let i = 0; i < props.poolList.length; i++) {
                    let token = tokens[i]
                    let response = await token.methods.balanceOf(account).call()

                    if (response) {
                        balances.push(fixNumber(response, 18))
                    }
                    // console.log('currentBalance', fixNumber(response, 18))
                }
                setBalances(balances)           
            }

            getUserTokenBalances()
        } catch (e) {
            console.log(e)
            addAlert(t('errors.getUserTokenBalances'))
        }
    }, [account])

    return (
        <div className="pools_panel__content_input_container">
            <div className="pools_panel__content_input pools_panel__content_input-selector" onClick = {onClickInput}>
                <div className="pools_panel__content_input__selector">
                    <img src={props.poolList[props.rootStore.user.selectedPool].token.logotype} alt="" />
                    <p>{props.poolList[props.rootStore.user.selectedPool].token.name}</p>
                </div>
                <img className="pools_panel__content_input__chevron" src={chevron} alt="chevron-right" />
            </div>

            {expanded &&
                <div className="pools_panel__content_input__expanded">
                    {props.poolList.map((pool, index) =>
                        <div key = {index} className="pools_panel__content_input__expanded_item" onClick = {() => onClickItem(index)}>
                            <div className="pools_panel__content_input__expanded_item__token">
                                <img src={pool.token.logotype} alt={pool.token.name} />
                                <p>{pool.token.name}</p>
                            </div>
                            
                            <p className="pools_panel__content_input__expanded_item__balance">{balances[index]}</p>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}))

export default Selector;