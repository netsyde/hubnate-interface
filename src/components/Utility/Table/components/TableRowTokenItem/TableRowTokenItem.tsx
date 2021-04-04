import ITableRowTokenItem from '@src/types/Utility/Table/ITableRowTokenItem';

const TableRowTokenItem = (props: ITableRowTokenItem) => {
    return (
        <td>
            <div className = "table_token">
                <img className = "table_token__icon" src={props.logo} alt={props.ticker}/>
                <p className = "table_token__ticker">{props.ticker}</p>
            </div>
        </td>
    )
}

export default TableRowTokenItem;