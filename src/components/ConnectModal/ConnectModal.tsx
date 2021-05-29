import { Fade, IWallet } from '@src/types'
import { WalletCard } from './components'
import wallets from '@src/data/wallets'
import { useTranslation } from 'next-i18next'

interface IConnectModal {
    login: any,
    fade?: Fade,
    style?: any,
    onDismiss?: any
}

const ConnectModal = (props: IConnectModal) => {
    const { t } = useTranslation()
    const modalOnClick = (e: any) => {
        e.stopPropagation();
    }

    return (
        <div className={`wallet ${props.fade}`} onClick = {modalOnClick}>
            <div className="wallet_title">
                <h2 className="wallet_title__text">{t("main.connectWallet")}</h2>
            </div>
            <div className="wallet_cards">
            {wallets.map((wallet: IWallet, index: number) => (
                <WalletCard key = {index} login = {props.login} wallet = {wallet} closeModal = {props.onDismiss}/>
            ))}
            </div>
        </div>
    )
}

export default ConnectModal;