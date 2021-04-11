import { ITableRow } from '@src/types/Utility/Table';
import React from "react";
import { TableDetailsRowItem } from '@components/Utility/Table/components';

const TableRow = React.forwardRef((props: ITableRow, ref: any) => {
    return (
        <tr style={props.style} className={props.className} onClick={props.onClick} ref={ref}>
            {props.children}
            {
                props.isMobile ? (
                    <TableDetailsRowItem
                        isOpen = {props.isOpen}
                        displayOnMobile = {props.isMobile}
                    />
                ) : null
            }
        </tr>
    )
})

export default TableRow;