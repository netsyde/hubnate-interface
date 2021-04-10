export interface ITableRow {
    style?: any,
    className?: any,
    children: React.ReactNode,
    onClick?: MouseEventHandler<HTMLTableRowElemen>,
    // ref?: LegacyRef<HTMLTableRowElement>
}

export interface ITableRowItem {
    children: React.ReactNode,
    className?: string
}

export interface ITableRowMetaItem {
    title: string,
    value: string
}

export interface ITableRowTokenItem {
    ticker: string,
    logo: any
}

export interface ITableDetailsRowItem {
    isOpen: boolean
}

export interface ITable {
    children: React.ReactNode
}