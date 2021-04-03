import { Button } from '@components/Utility';
import { Pools, Utility } from '@src/types'
// import IButton from '@types'
const convertNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

interface ITableRowItem {
    type: RowItemType,
    ticker?: string,
    logo?: any,
    button?: Utility.IButton,
    meta?: string,
    metaNumber?: number
}

type RowItemType = 'button' | 'meta' | 'ticker'

interface ITable {
    elements: Array<any>,
    onClickDonate: any,
    openDonateModal: boolean | 'initial'
}

const Table = (props: ITable) => {
    return (
        <table className = "table">
            <tbody>
                {props.elements.map((pool: Pools.IPool, index: number) =>
                    <tr key = {index} style={pool.active ? null : {filter: "blur(5.2px)", userSelect: 'none'}}>                       
                        <td>
                            <div className = "table_token">
                                <img className = "table_token__icon" src={pool.logotype} alt="BNB"/>
                                <p className = "table_token__ticker">{pool.name}</p>
                            </div>
                        </td>
                        <td>
                            <p className = "table_meta">Total donated</p>
                            <p className = "table_meta-number">${convertNumber(pool.totalDonated)}</p>
                        </td>
                        <td>
                            <p className = "table_meta">Chance</p>
                            <p className = "table_meta-number">{pool.chance}%</p>
                        </td>
                        <td>
                            <p className = "table_meta">Your Deposit</p>
                            <p className = "table_meta-number">${convertNumber(pool.yourDeposit)}</p>
                        </td>
                        <td>
                            <p className = "table_meta">Donaters</p>
                            <p className = "table_meta-number">${convertNumber(pool.donaters)}</p>
                        </td>

                        <td>
                            <Button 
                                name = "Donate"
                                link = {`#${pool.name}`}
                                type = {pool.active ? 'default' : 'disabled'}
                                padding = "10px 100px"
                                onClick = {pool.active ? () => props.onClickDonate(pool) : null}
                                className = {props.openDonateModal == true ? 'blocked-selection' : ''}
                            />
                        </td>
                        
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default Table