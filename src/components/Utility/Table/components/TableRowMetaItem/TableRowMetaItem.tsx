import { ITableRowMetaItem } from '@src/types/Utility/Table';

const TableRowMetaItem = (props: ITableRowMetaItem) => {
    if (!props.displayOnMobile) return null;
    
    return (
        <td>
            <p className = "table_meta">{props.title}</p>
            <p className = "table_meta-number">{props.value}</p>
        </td>
    )
}

export default TableRowMetaItem;