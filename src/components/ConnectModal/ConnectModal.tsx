import { Fade, IWallet } from '@src/types'
import { WalletCard } from './components'
import wallets from '@src/data/wallets'

interface IConnectModal {
    login: any,
    fade?: Fade,
    style?: any,
    onDismiss?: any
}

const ConnectModal = (props: IConnectModal) => {

    const modalOnClick = (e: any) => {
        e.stopPropagation();
    }

    return (
        <div className={`wallet ${props.fade}`} onClick = {modalOnClick}>
            <div className="wallet_title">
                <h2 className="wallet_title__text">Connect to a wallet</h2>
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