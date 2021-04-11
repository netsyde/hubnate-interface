import Link from 'next/link';

interface IMenuItem {
    name: string,
    link: string,
    isButton?: boolean
}

const MenuItem = (props: IMenuItem) => {
    return (
        <Link href = {props.link} >
            <a className = {props.isButton ? "default-button" : "header_menu__link"} >
                <p>
                    {props.name}
                </p>
            </a>
        </Link>
    )
}

export default MenuItem;