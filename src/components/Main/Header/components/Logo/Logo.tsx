import Link from 'next/link';
const logoBlue = require('@images/ui/logo-blue.svg')
const logoWhite = require('@images/ui/logo-white.svg')

interface ILogo {
    className: string,
    name: string,
    isMobile: boolean,
    color: 'white' | 'blue'
}

const Logo = (props: ILogo) => {

    if (props.isMobile) {
        return (
            <Link href = {"/"} >
                <img src = {props.color == 'white' ? logoWhite : logoBlue } alt="logo" className = {'header_logo-mobile'}/>
            </Link>
        )
    }

    return (
        <Link href = {"/"} >
            <a className = {props.className}>
                <p>{props.name}</p>
            </a>
        </Link>
    )
}

export default Logo;