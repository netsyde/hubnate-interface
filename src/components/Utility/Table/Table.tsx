import { ITable } from '@src/types/Utility/Table'

const Table = (props: ITable) => {
    return (
        <table className = {`table ${props.className ? props.className : ''}`}>
            <tbody>
               {props.children}
            </tbody>
        </table>
    )
}

export default Table