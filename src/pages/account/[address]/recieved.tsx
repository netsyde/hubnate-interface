import { useRouter } from 'next/router';
import { Main } from '@src/layouts'
import { Container } from '@components/Utility'
import { Button, Table } from '@components/Utility'
import { TableRow, TableRowTokenItem, TableRowItem, TableRowMetaItem } from '@components/Utility/Table/components';
import recivedDonates from '@src/data/donates'
import { IPool } from '@src/types/Pools';
import donates from '@src/data/donates';
import Head from 'next/head';

const convertNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

interface IPoolMinifyInfo {
    name: string,
    logotype: any
}

interface IDonate {
    pool: IPoolMinifyInfo,
    txHash: string,
    amount: number,
    donater: string,
    fiatEquivalent: number,
    winTicket: number
}

const getTotalAmount = (donates: IDonate[]) => {
    let total = 0;

    for (let i = 0; i < donates.length; i++) {
        let donate = donates[i];
        total += donate.fiatEquivalent;
    }
    return total;
}

interface IRecieved {
    data: any
}

const Recieved = (props: IRecieved) => {
    const address = props.data.address;

    if (address) {
        return (
            <>
                <Head>
                    <title>Hubnate | Account Recieved</title>
                </Head>
                <Main>
                    <div className = "account">
                        <Container
                            className = {"account_container"}
                            title = {"Account Recieved"}
                            address = {address ? address.toString() : "0xaC0dB4c98A3C2dDaa16Fe54B0487F86b227F7B1d"}
                        >
                            <div className = "account_main account_recieved">
                                <div className = "account_main__info">
                                    <p className = {"account_text"}>Donates recieved: {donates.length}</p>
                                    <p className = {"account_text"}>Fiat equivalent: {convertNumber( getTotalAmount(donates) )}</p>
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
                                        name = "Back"
                                        link = {`/account/${address}`}
                                        type = {'default'}
                                        padding = "10px 20px"
                                    />
                                </div>
                            </div>
                            <Table>
                                {recivedDonates.map((donate: IDonate, index: number) => 
                                    <TableRow
                                        key = {index}
                                    >
                                        <TableRowTokenItem 
                                            ticker = {donate.pool.name}
                                            logo = {donate.pool.logotype}
                                        />
                                        <TableRowMetaItem
                                            title = {"Amount"}
                                            value = {convertNumber(donate.amount)}
                                        />
                                        <TableRowMetaItem
                                            title = {"Donater"}
                                            value = {donate.donater}
                                        />
                                        <TableRowMetaItem
                                            title = {"Fiat Equivalent"}
                                            value = {`$${convertNumber(donate.fiatEquivalent)}`}
                                        />
                                        <TableRowMetaItem
                                            title = {"Win Ticket"}
                                            value = {convertNumber(donate.winTicket)}
                                        />
                                        <TableRowItem>
                                            <Button 
                                                name = "View"
                                                link = {`https://bscscan.com/tx/${donate.txHash}`}
                                                type = {'default'}
                                                padding = "10px 100px"
                                            />
                                        </TableRowItem>
                                    </TableRow>
                                )}
                                
                            </Table>
                        </Container>
                    </div>
                </Main>
            </>
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

export default Recieved;