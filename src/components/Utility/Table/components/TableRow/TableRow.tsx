import { ITableRow } from '@src/types/Utility/Table';
import React from "react";

const TableRow = React.forwardRef((props: ITableRow, ref: any) => {
    return (
        <tr style={props.style} className={props.className} onClick={props.onClick} ref={ref}>
            {props.children}
        </tr>
    )
})

export default TableRow;