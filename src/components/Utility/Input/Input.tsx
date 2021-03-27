import { MouseEventHandler } from "react";

interface IInput {
    placeholder: string,
    type: 'text' | 'number',
    padding?: string,
    // onClick?: MouseEventHandler<HTMLAnchorElement>,
    className?: string
}

const Input = (props: IInput) => {
    return <input type="text" className="inpur-default"/>
}

export default Input