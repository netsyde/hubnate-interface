interface ITable {
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