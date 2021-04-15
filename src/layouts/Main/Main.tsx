import { Header } from '@components/Main'
import { Menu, MenuItem, Logo, MobileMenu } from '@components/Main/Header/components'
import { Button } from '@components/Utility'
import { useWindowSize, minifyString } from '@src/utils';
import useAuth from '@src/hooks/useAuth'
import { useState } from 'react';
import { Shadow, Fade } from '@src/types'
import WalletModal from '@components/WalletModal';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore'
import { useModal } from '@src/widgets/Modal'

const isMobile = (width: number) => {
    if (width <= 882) return true
    return false;
}

interface IMain {
    children: React.ReactNode,
    headerClassName?: string,
    logoColor?: 'white' | 'blue',
    className?: string,
    mobileMenuType?: 'transparent' | 'default',
    rootStore?: RootStore
}

const menuItems = [
    {
        name: "Pools",
        link: '/pools',
        isButton: false
    },
    {
        name: "Account",
        link: '/account/0xaC0dB4c98A3C2dDaa16Fe54B0487F86b227F7B1d',
        isButton: false
    },
    {
        name: "Community",
        link: '#',
        isButton: false
    },
    {
        name: "About",
        link: '#',
        isButton: false
    }
]

import { useWeb3React } from '@web3-react/core';

const Main = inject("rootStore")(observer((props: IMain) => {
    const size = useWindowSize();
    const [current, setCurrent] = useState<boolean[]>(menuItems.map(() => false))
    const { login, logout } = useAuth()
    const { account } = useWeb3React()

    const [onPresentWalletModal] = useModal(
        <WalletModal 
            login = {login}
        />
    )

    return (
        <div className = {`main ${props.className}`}>
            <div className = "main_opacity">
                <Header 
                    className = {`header ${props.headerClassName}`}
                >
                    <Logo 
                        className = {`header_logo`}
                        name = "Hubnate"
                        isMobile = {isMobile(size.width)}
                        color = {props.logoColor}
                    />
                    <Menu
                        className = {'header_menu'}
                        isMobile = {isMobile(size.width)}
                    >
                        {menuItems.map((item, index) =>
                            <MenuItem 
                                key = {index}
                                name = {item.name}
                                link = {item.link}
                                isButton = {item.isButton}
                            />   
                        )}
                        <Button 
                            name = {props.rootStore.user.isConnected ? minifyString(account) :"Connect"}
                            type = {'default'}
                            padding = "10px 20px"
                            onClick = {onPresentWalletModal}
                        />
                    </Menu>
                </Header>
                {props.children}
                {isMobile(size.width) ? <MobileMenu current = {current} setCurrent = {setCurrent} transparent = {props.mobileMenuType == 'transparent'}/> : null}
            </div>
        </div>
    )
}))

export default Main