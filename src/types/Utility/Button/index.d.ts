export interface IButton {
    name: string,
    link: string,
    type: ButtonType,
    padding?: string,
    onClick?: MouseEventHandler<HTMLAnchorElement>,
    className?: string
}

export type ButtonType = 'transparent' | 'default' | 'disabled';