import { IWallet, Login } from '@src/types'

interface IWalletCard {
    login: Login,
    wallet: IWallet,
    closeModal: any
}

// export type Login = (connectorId: ConnectorNames) => void;

const WalletCard = (props: IWalletCard) => {

    const handleClick = () => {
        props.login(props.wallet.connectorId)
        props.closeModal()
    }

    return (
        <div className="wallet_cards__item" onClick = {handleClick}>
            <img src={props.wallet.icon} alt={props.wallet.title}/>
            <p>{props.wallet.title}</p>
        </div>
    )
}

export default WalletCard;