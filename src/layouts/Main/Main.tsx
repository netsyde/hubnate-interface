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
    type WalletModalState = boolean | 'initial'
    const size = useWindowSize();
    const [openWalletModal, setOpenWalletModal] = useState<WalletModalState>(false); // mobile menu
    const [current, setCurrent] = useState<boolean[]>(menuItems.map(() => false))
    const [fade, setFade] = useState<Fade>('')
    const [shadow, setShadow] = useState<Shadow>('')
    const { login, logout } = useAuth()
    const { account } = useWeb3React()

    const calcShadow = (walletModalState: WalletModalState) => {
        switch (walletModalState) {
            case 'initial': return '';
            case true: return 'container-shadow';
            case false: return 'container-shadowOut';
        }
    }

    const calcFade = (walletModalState: WalletModalState) => {
        switch (walletModalState) {
            case 'initial': return '';
            case true: return 'fadeIn';
            case false: return 'fadeOut';
        }
    }

    const handleOpenWalletModal = () => {
        setFade(calcFade(true))
        setShadow(calcShadow(true))
        
        setOpenWalletModal(true)
    }

    const handleCloseWalletModal = () => {
        setFade(calcFade(false))
        setShadow(calcShadow(false))
        setTimeout(() => setOpenWalletModal(false), 1000)
    }

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
                            onClick = {handleOpenWalletModal}
                        />
                    </Menu>
                </Header>
                {openWalletModal == true ?
                    <div className = {`donate-modal-wrapper ${shadow}`} onClick = {openWalletModal === true ? () => handleCloseWalletModal() : null}>
                        <WalletModal 
                            fade = {fade}
                            login = {login}
                            closeModal = {handleCloseWalletModal}
                        />
                    </div> : null
                }
                {props.children}
                {isMobile(size.width) ? <MobileMenu current = {current} setCurrent = {setCurrent} transparent = {props.mobileMenuType == 'transparent'}/> : null}
            </div>
        </div>
    )
}))

export default Main