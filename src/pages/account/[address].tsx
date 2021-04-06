import { Main } from '@src/layouts'
import { Container } from '@components/Utility'
import { Button, Chart } from '@components/Utility'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { IChartApi } from 'lightweight-charts'
import poolList from '@src/data/userInPools'
import { PoolSelector } from '@components/Account';

interface IAccount {
    data: any
}

const Account = (props: IAccount) => {
    const address = props.data.address;
    const [selectedPool, setSelectedPool] = useState<number>(0);
    const [chart, setChart] = useState<IChartApi>(null);

    if (address) {
        return (
            <Main>
                <div className = "account">
                    <Container
                        className = {"account_container"}
                        title = {"Account"}
                        address = {address ? address.toString() : "0xaC0dB4c98A3C2dDaa16Fe54B0487F86b227F7B1d"}
                    >
                        <div className = "account_main">
                            <div className = "account_main__info">
                                <PoolSelector 
                                    pools = {poolList}
                                    selectedPool = {selectedPool}
                                    setSelectedPool = {setSelectedPool}
                                />
                                <p className = {"account_text"}>Chance: 21.4% (1589 tickets)</p>
                                <p className = {"account_text"}>Total donated: 327</p>
                            </div>
                            <div className = "account_main__buttons">
                                <Button 
                                    name = "Sended"
                                    link = {`/account/${address}/sended`}
                                    type = {'disabled'}
                                    padding = "10px 20px"
                                    className = {"mr10"}
                                    
                                />
                                <Button 
                                    name = "Recieved"
                                    link = {`/account/${address}/recieved`}
                                    type = {'default'}
                                    padding = "10px 20px"
                                />
                            </div>
                        </div>
                        <Chart
                            chart = {chart}
                            setChart = {setChart}
                            data = {poolList[selectedPool]}
                            selectedPool = {selectedPool}
                        />
                    </Container>
                </div>
            </Main>
        )
    } else {
        return null
    }
}

export const getServerSideProps = async (contex: any) => {
    const data = {
        address: contex.query.address
    }
    return { props: { data } }
}

export default Account;