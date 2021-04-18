import { IWallet, Login } from '@src/types';
import { inject, observer } from "mobx-react";
import { RootStore } from '@src/store/RootStore';

interface IWalletCard {
    login: Login,
    wallet: IWallet,
    closeModal: any,
    rootStore?: RootStore
}

const WalletCard = inject("rootStore")(observer((props: IWalletCard) => {
    const handleClick = () => {
        props.login(props.wallet.connectorId)
        props.rootStore.user.connectAccount()
        window.localStorage.setItem("connectorId", props.wallet.connectorId);
        props.closeModal()
    }

    return (
        <div className="wallet_cards__item" onClick = {handleClick}>
            <img src={props.wallet.icon} alt={props.wallet.title}/>
            <p>{props.wallet.title}</p>
        </div>
    )
}))

export default WalletCard;