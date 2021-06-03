import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { IPool } from '@src/types/Pools';
import { RootStore } from '@src/store/RootStore';
import { Selector, StatsItem } from '../';
import { useSnackbar } from '@src/widgets/Snackbar'
import { useHubnate, useERC20, useCT } from '@src/hooks/useContract'

interface IPoolsPanel {
    poolList: IPool[],
    rootStore?: RootStore
}

const Claim = inject("rootStore")(observer((props: IPoolsPanel) => {
    return (
        <div></div>
    )
}))

export default Claim;