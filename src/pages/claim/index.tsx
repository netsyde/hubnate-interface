import React, { useState, useEffect } from "react";
import { Main } from '@src/layouts';
import { Container } from '@components/Utility';
import { Claim as PoolClaim, Panel } from '@components/Pools';
import { IPool } from '@src/types/Pools';
import Head from 'next/head';
import { useWeb3React } from '@web3-react/core';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import poolsGap from '@src/data/constants/pools'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from '@src/next-i18next.config.js'
import { useTranslation } from 'next-i18next'
import { useSnackbar } from '@src/widgets/Snackbar'

interface IPools {
    rootStore?: RootStore
}

const Claim = inject("rootStore")(observer((props: IPools) => {
    const { t } = useTranslation()
    const [poolList, setPoolList] = useState<IPool[]>(poolsGap)
    const { account } = useWeb3React()
    const hubnateContract = useHubnate()
    const CTcontracts = poolList.map((pool) => useCT(pool.CT[4]))   
    const { addAlert } = useSnackbar() 

    useEffect(() => {
        try {
            const getPoolList = async () => {
                let fetchPoolList = await props.rootStore.user.getPools(hubnateContract, CTcontracts, account) || poolsGap;
                // console.log(fetchPoolList)
                if (fetchPoolList) {
                    setPoolList(fetchPoolList)
                }
            }
            
            getPoolList()
        } catch (e) {
            addAlert(e.message)
            console.log(e)
        }
    }, [account, props.rootStore.user.autoUpdateObserver]);

    return (
        <>
            <Head>
                <title>Hubnate | Claim</title>
            </Head>
            <Main
            >
                <div className = "pools_container">
                    <Container 
                        title = {t("titles.app")}
                        address = {''}
                    >
                        <div className="pools">
                            <PoolClaim 
                                poolList = {poolList}
                            />
                            <Panel 
                                poolList = {poolList}
                            />
                        </div>
                    </Container>
                </div>
            </Main>
        </>
    )
}))

interface IStaticProps {
    locale: any
}

export const getStaticProps = async (data: IStaticProps) => ({
    props: {
      ...await serverSideTranslations(data.locale, ['common'], nextI18NextConfig),
    },
})

export default Claim;
