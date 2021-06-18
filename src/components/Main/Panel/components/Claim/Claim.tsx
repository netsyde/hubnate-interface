import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { IPool } from '@src/types/Pools';
import { RootStore } from '@src/store/RootStore';
import { Selector, StatsItem } from '../';
import { useSnackbar } from '@src/widgets/Snackbar'
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'
import { useTranslation } from 'next-i18next'
import { Button } from '@components/Utility';
interface IPoolsPanel {
    poolList: IPool[],
    rootStore?: RootStore
}

const Claim = inject("rootStore")(observer((props: IPoolsPanel) => {
    const { t } = useTranslation()

    const onClickButton = () => {

    }
    return (
        <div className="pools_panel_claim">
            <div className="pools_panel_claim__radial">
                <svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80" className="token-circle">
                    <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(136, 163, 200, 0.2)" strokeWidth="14" strokeDasharray="3, 5" transform="rotate(180 80 80)"></circle>
                    <mask id="myMask">
                        <circle cx="80" cy="80" r="72" fill="none" stroke="#fff" strokeWidth="14" strokeDasharray="3, 5" transform="rotate(182 80 80)"></circle>
                    </mask>
                    <circle cx="80" cy="80" r="72" fill="none" strokeWidth="14" strokeDashoffset="0" opacity="0.3" transform="rotate(180 80 80)" mask="url(#myMask)" strokeDasharray="0, 226" stroke="#8e44ad"></circle>
                        <circle cx="80" cy="80" r="72" fill="none" strokeWidth="14" strokeDashoffset="0" transform="rotate(180 80 80)" mask="url(#myMask)" strokeDasharray="226, 226" stroke="#8e44ad"></circle>
                    <circle cx="80" cy="80" r="60" fill="none" strokeWidth="1" strokeDashoffset="0" stroke="rgba(136, 163, 200, 0.2)" strokeDasharray="377" transform="rotate(180 80 80)"></circle> 
                </svg>
                <div className="pools_panel_claim__radial_info">
                <p className="pools_panel_claim__radial_info__value">
                        220
                    </p>
                    <p className="pools_panel_claim__radial_info__title">
                        Доступно CT
                        {/* {t('panel.claim.available')} */}
                    </p>
                </div>
            </div>
        </div>
    )
}))

export default Claim;