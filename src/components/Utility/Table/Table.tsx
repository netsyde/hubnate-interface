import { Button } from '@components/Utility';
import { Pools, Utility } from '@src/types'
// import IButton from '@types'

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
    openDonateModal: boolean | 'initial',
    children: React.ReactNode
}

const Table = (props: ITable) => {
    return (
        <table className = "table">
            <tbody>
               {props.children}
            </tbody>
        </table>
    )
}

export default Table