import { ITableRowItem } from '@src/types/Utility/Table';

const TableRowItem = (props: ITableRowItem) => {
    return (
        <td className = {props.className}>
            {props.children}
        </td>
    )
}

export default TableRowItem;