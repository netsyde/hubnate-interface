import { IButton } from '@src/types/Utility/Button';
import Link from 'next/link';


const Button = (props: IButton) => {
    return (
        <Link href={props.link} >
            <a className={`${props.type}-button ${props.className}`} style={{padding: props.padding}} onClick={props.onClick}>
                <p>
                    {props.name}
                </p>
            </a>
        </Link>
    )
}

export default Button;