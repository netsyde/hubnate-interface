import { MouseEventHandler } from "react";

interface IButton {
    name: string,
    link: string,
    type: ButtonType,
    padding?: string,
    onClick?: MouseEventHandler<HTMLAnchorElement>,
    className?: string
}

type ButtonType = 'transparent' | 'default' | 'disabled';

export default IButton;