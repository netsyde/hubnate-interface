export { default as IButton } from './IButton';
export { default as Table } from './Table';

export interface IContainer {
    title: string,
    className?: string,
    onClick?: MouseEventHandler<HTMLDivElement>,
    children: React.ReactNode,
    onClickElement?: MouseEventHandler<HTMLDivElement>,
    address?: string
}
