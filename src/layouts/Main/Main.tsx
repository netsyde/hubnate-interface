import { Header } from '@components/Main'
import { Menu, MenuItem, Logo, MobileMenu } from '@components/Main/Header/components'
import { Button } from '@components/Utility'
import { useWindowSize, minifyString } from '@src/utils';
import useAuth from '@src/hooks/useAuth'
import { useState } from 'react';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore'
import { useWalletModal } from '@src/widgets/WalletModal'
import { useWeb3React } from '@web3-react/core';
import useEagerConnect from '@src/hooks/useEagerConnect'

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

const Main = inject("rootStore")(observer((props: IMain) => {
    const { account } = useWeb3React()
    const menuItems = [
        {
            name: "Pools",
            link: '/pools',
            isButton: false
        },
        {
            name: "Account",
            link: `/account/${account}`,
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

    useEagerConnect()
    const size = useWindowSize();
    const [current, setCurrent] = useState<boolean[]>(menuItems.map(() => false))
    const { login, logout } = useAuth()
    const user = props.rootStore.user;
    const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account)

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
                            name = {account ? minifyString(account) : "Connect"}
                            type = {'default'}
                            padding = "10px 20px"
                            onClick = {account ? onPresentAccountModal : onPresentConnectModal}
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