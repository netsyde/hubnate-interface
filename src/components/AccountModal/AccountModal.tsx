import { Fade, IWallet } from '@src/types';
import { Button } from '@components/Utility'
import { useTranslation } from 'next-i18next'

interface IConnectModal {
    fade?: Fade,
    style?: any,
    onDismiss?: any,
    account: string,
    logout: () => void
}

const ConnectModal = (props: IConnectModal) => {
    const { t } = useTranslation()
    const modalOnClick = (e: any) => {
        e.stopPropagation();
    }

    const onClickLogout = () => {
        props.logout()
        window.localStorage.removeItem("connectorId")
        props.onDismiss()
    }

    return (
        <div className={`wallet ${props.fade}`} onClick = {modalOnClick}>
            <div className="wallet_title">
                <h2 className="wallet_title__text">{t("main.yourAccount")}</h2>
            </div>
            <div className="wallet_body">
                <p>{props.account}</p>
                <Button 
                    name = {t("main.logout")}
                    type = {'default'}
                    padding = "10px 20px"
                    onClick = {onClickLogout}
                />
            </div>
        </div>
    )
}

export default ConnectModal;