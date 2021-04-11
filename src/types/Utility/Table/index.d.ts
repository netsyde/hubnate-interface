export interface ITableRow {
    style?: any,
    className?: any,
    children: React.ReactNode,
    onClick?: MouseEventHandler<HTMLTableRowElemen>,
    isMobile: boolean,
    isOpen: boolean
    // ref?: LegacyRef<HTMLTableRowElement>
}

export interface ITableRowItem {
    children?: React.ReactNode,
    className?: string,
    displayOnMobile?: boolean
}

export interface ITableRowMetaItem extends ITableRowItem {
    title: string,
    value: string
}

export interface ITableRowTokenItem extends ITableRowItem {
    ticker: string,
    logo: any
}

export interface ITableDetailsRowItem extends ITableRowItem {
    isOpen: boolean
}

export interface ITable {
    children: React.ReactNode
}