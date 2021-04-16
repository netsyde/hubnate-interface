import { Fade, IWallet } from '@src/types';
import { Button } from '@components/Utility'

interface IConnectModal {
    fade?: Fade,
    style?: any,
    onDismiss?: any,
    account: string,
    logout: () => void
}

const ConnectModal = (props: IConnectModal) => {

    const modalOnClick = (e: any) => {
        e.stopPropagation();
    }

    const onClickLogout = () => {
        props.logout()
        props.onDismiss()
    }

    return (
        <div className={`wallet ${props.fade}`} onClick = {modalOnClick}>
            <div className="wallet_title">
                <h2 className="wallet_title__text">Your account</h2>
            </div>
            <div className="wallet_body">
                <p>{props.account}</p>
                <Button 
                    name = {"Logout"}
                    type = {'default'}
                    padding = "10px 20px"
                    onClick = {onClickLogout}
                />
            </div>
        </div>
    )
}

export default ConnectModal;