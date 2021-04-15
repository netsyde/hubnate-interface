import { Fade, IWallet } from '@src/types'
import { WalletCard } from './components'
import wallets from '@src/data/wallets'

interface IWalletModal {
    login: any,
    fade: Fade,
    style?: any,
    closeModal: any
}

const WalletModal = (props: IWalletModal) => {

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
                <WalletCard key = {index} login = {props.login} wallet = {wallet} closeModal = {props.closeModal}/>
            ))}
            </div>
        </div>
    )
}

export default WalletModal;