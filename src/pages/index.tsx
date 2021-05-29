import React, { useState, useEffect } from "react";
import { Main as MainLayout } from '@src/layouts';
import { Container } from '@components/Utility';
import { Info, Panel } from '@components/Pools';
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

const Main = inject("rootStore")(observer((props: IPools) => {
    const [poolList, setPoolList] = useState<IPool[]>(poolsGap)
    const { account } = useWeb3React()
    const hubnateContract = useHubnate()
    const { t } = useTranslation()
    const CTcontracts = poolList.map((pool) => useCT(pool.CT[4]))    
    const { addAlert } = useSnackbar()

    const onClickSettings = () => {
        // addAlert('on click settings')
    }

    useEffect(() => {
        try {
            const getPoolList = async () => {
                try {
                    if (account) {
                        let fetchPoolList = await props.rootStore.user.getPools(hubnateContract, CTcontracts, account);
                        if (fetchPoolList && fetchPoolList.length > 0) {
                            setPoolList(fetchPoolList)
                        }
                    }
                } catch (e) {
                    addAlert(e.message)
                    console.log(e)
                }
            }
            
            getPoolList()
        } catch (e) {

            console.log(e)
        }
    }, [account, props.rootStore.user.autoUpdateObserver]);

    return (
        <>
            <Head>
                <title>Hubnate | App</title>
            </Head>
            <MainLayout
            >
                <div className = "pools_container">
                    <Container 
                        title = {t("titles.app")}
                        onClickElement = {onClickSettings}
                    >
                        <div className="pools">
                            <Info 
                                poolList = {poolList}
                            />
                            <Panel 
                                poolList = {poolList}
                            />
                        </div>
                    </Container>
                </div>
            </MainLayout>
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

export default Main;
