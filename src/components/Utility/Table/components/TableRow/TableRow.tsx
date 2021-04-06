import { ITableRow } from '@src/types/Utility/Table';

const TableRow = (props: ITableRow) => {
    return (
        <tr style={props.style} className={props.className}>
            {props.children}
        </tr>
    )
}

export default TableRow;