import { ITableDetailsRowItem } from '@src/types/Utility/Table';
const detailsIcon = require('@images/ui/details.svg')

const TableDetailsRowItem = (props: ITableDetailsRowItem) => {
    return (
        <td>
            <img className = {`table_arrow ${props.isOpen ? 'table_arrow-open' : ''}`} src={detailsIcon} alt={"arrow"} />
        </td>
    )
}

export default TableDetailsRowItem;