export { default as Pools } from './Pools';
export { default as Utility } from './Utility';
export { default as WalletModal } from './WalletModal';

export type Fade = 'fadeIn' | 'fadeOut' | ''
export type Shadow = '' | 'container-shadow' | 'container-shadowOut'

export enum ConnectorNames {
    Injected = "injected",
    WalletConnect = "walletconnect",
    BSC = "bsc",
}

export interface IWallet {
    title: string;
    icon: any;
    connectorId: ConnectorNames;
}

export type Login = (connectorId: ConnectorNames) => void;