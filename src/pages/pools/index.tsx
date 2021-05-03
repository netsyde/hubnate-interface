import React, { useState, useEffect } from "react";
import { Main } from '@src/layouts';
import { Container } from '@components/Utility';
import DonateModal from '@components/DonateModal';
import ConnectModal from '@components/ConnectModal';
import { IPool } from '@src/types/Pools';
import { Button, Table } from '@components/Utility';
import { TableRow, TableRowTokenItem, TableRowItem, TableRowMetaItem } from '@components/Utility/Table/components';
import Head from 'next/head';
import { useWindowSize, convertNumber } from '@src/utils';
import { useModal } from '@src/widgets/Modal';
import { useWeb3React } from '@web3-react/core';
import useAuth from '@src/hooks/useAuth';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';
import { useDonate, useERC20 } from '@src/hooks/useContract'
import Skeleton from 'react-loading-skeleton';
import poolsGap from '@src/data/constants/pools'

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IExpandedRow {
    index: number,
    poolList: IPool[],
    onClick: any,
    openDonateModal?: any
}

const ExpandedRow = (props: IExpandedRow) => {
    const { account } = useWeb3React()
    const poolList = props.poolList;
    return (
        <tr className = "row_expanded">
            <td>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Chance</p>
                    <p className = "table_meta-number">{convertNumber(poolList[props.index].chance)}% || <Skeleton/></p>
                </div>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Donated (your)</p>
                    <p className = "table_meta-number">{(account ? convertNumber(poolList[props.index].userDonated) : 'locked') || <Skeleton/>}</p>
                </div>
                <div className = "row_expanded__line">
                    <p className = "table_meta">Recieved (your)</p>
                    <p className = "table_meta-number">{(account ? convertNumber(poolList[props.index].userRecieved) : 'locked') || <Skeleton/>}</p>
                </div>
                <div className = "row_expanded__line row_expanded__line-center">
                    <Button 
                        name = {account ? `Donate` : `Unlock Wallet`}
                        type = {poolList[props.index].active ? 'default' : 'disabled'}
                        padding = "10px 100px"
                        onClick = {props.onClick}
                    />
                </div>
            </td>
        </tr>
    )
}


interface IPools {
    rootStore?: RootStore
}

const metaNumber = (number: number) => {
    try {
        return typeof(number) == 'number' && `${convertNumber(number)}` || <Skeleton/>
    } catch (e) {
        return <Skeleton/>
    }
}

const metaAccountNumber = (number: number, account: string) => {
    try {
        return typeof(number) == 'number' && (account ? `${convertNumber(number)}` : `locked`) || <Skeleton/>
    } catch (e) {
        return <Skeleton/>
    }
}

const Pools = inject("rootStore")(observer((props: IPools) => {
    let [selectedPool, setSelectedPool] = useState<number>(0);
    const size = useWindowSize();
    const [poolList, setPoolList] = useState<IPool[] || false>(false)
    const [chevrons, setChevrons] = useState<boolean[]>(poolList ? poolList.map(() => false) : [false])
    const { account } = useWeb3React()
    const { login } = useAuth()
    const donateContract = useDonate()
    
    useEffect(() => {
        const getPoolList = async () => {
            let fetchPoolList =  await props.rootStore.user.getPools(donateContract, account) || poolsGap;
            console.log(fetchPoolList)
            if (fetchPoolList) {
                setPoolList(fetchPoolList)
            }
        }
        
        getPoolList()
    }, [account]);

    let [onPresentDonateModal] = useModal(
        <DonateModal 
            pools = {poolList ? poolList : false} // poolList.filter((pool) => pool.active)
            selectedPool = {selectedPool}
            setSelectedPool = {setSelectedPool}
        />
    )

    let [onPresentConnectModal] = useModal(
        <ConnectModal 
            login = {login}
        />
    )

    const onClickDonate = (index: number) => {
        setSelectedPool(index)
        onPresentDonateModal() // TODO: fix updating selectedPool ^
    }

    const onClickSettings = () => {
        alert('not implemented')
    }

    const handleTableRowClick = (index: number) => {
        let newChevrons = chevrons.concat()
        newChevrons[index] = !newChevrons[index]
        setChevrons(newChevrons)
    }

    return (
        <>
            <Head>
                <title>Hubnate | Pools</title>
            </Head>
            <Main
            >
                <div className = "pools">
                    <Container 
                        title = {"Pools"}
                        onClickElement = {() => onClickSettings()}
                    >
                        
                        <Table>
                            {poolList.map((pool: IPool, index: number) => 
                                <React.Fragment key={index}>
                                    <TableRow
                                        // style = {pool.active ? null : {filter: "blur(5.2px)", userSelect: 'none'}}
                                        onClick = {isMobile(size.width) ? () => handleTableRowClick(index) : null}
                                        isMobile = {isMobile(size.width)}
                                        isOpen = {chevrons[index]}
                                    >
                                        <TableRowTokenItem 
                                            ticker = {pool.token.name}
                                            logo = {pool.token.logotype}
                                            displayOnMobile = {true}
                                        />
                                        <TableRowMetaItem
                                            title = {"Cost per Ticket"}
                                            value = {metaNumber(pool.costPerTicket)}
                                            displayOnMobile = {true}
                                        /> 
                                        <TableRowMetaItem
                                            title = {"Total Donated"}
                                            value = {metaNumber(pool.totalDonated)}
                                            displayOnMobile = {true}
                                        />  
                                        <TableRowMetaItem
                                            title = {"Chance"}
                                            value = {metaAccountNumber(pool.chance, account)}
                                            displayOnMobile = {!isMobile(size.width)}
                                        />
                                        <TableRowMetaItem
                                            title = {"Donated (your)"}
                                            value = {metaAccountNumber(pool.userDonated, account)}
                                            displayOnMobile = {!isMobile(size.width)}
                                        />
                                        <TableRowMetaItem
                                            title = {"Recieved (your)"}
                                            value = {metaAccountNumber(pool.userRecieved, account)}
                                            displayOnMobile = {!isMobile(size.width)}
                                        />
                                        <TableRowItem
                                            displayOnMobile = {!isMobile(size.width)}
                                        >
                                            <Button 
                                                name = {account ? "Donate" : "Unlock Wallet"}
                                                link = {`#${pool.token.name}`}
                                                type = {pool.active ? 'default' : 'disabled'}
                                                padding = "10px 100px"
                                                onClick = {account ? (pool.active ? () => onClickDonate(index) : null) : onPresentConnectModal}
                                            />
                                        </TableRowItem>
                                    </TableRow>
                                    {chevrons[index] && isMobile(size.width) ?
                                        <ExpandedRow
                                            index = {index}
                                            poolList = {poolList}
                                            onClick = {account ? (pool.active ? () => onClickDonate(index) : null) : onPresentConnectModal}
                                        /> : null
                                    }
                                </React.Fragment>
                            )}
                        </Table>
                    </Container>
                </div>
            </Main>
        </>
    )
}))

export default Pools;

//
// <h2 className="failed_text">Pools fetch data is failed</h2>