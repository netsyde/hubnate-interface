const metamask = require("@images/ui/wallets/metamask.svg");

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

const connectors: IWallet[] = [
  {
    title: "Metamask",
    icon: metamask,
    connectorId: ConnectorNames.Injected,
  },
//   {
//     title: "TrustWallet",
//     icon: TrustWallet,
//     connectorId: ConnectorNames.Injected,
//   },
//   {
//     title: "MathWallet",
//     icon: MathWallet,
//     connectorId: ConnectorNames.Injected,
//   },
//   {
//     title: "TokenPocket",
//     icon: TokenPocket,
//     connectorId: ConnectorNames.Injected,
//   },
//   {
//     title: "WalletConnect",
//     icon: WalletConnect,
//     connectorId: ConnectorNames.WalletConnect,
//   },
//   {
//     title: "Binance Chain Wallet",
//     icon: BinanceChain,
//     connectorId: ConnectorNames.BSC,
//   },
//   {
//     title: "SafePal Wallet",
//     icon: SafePalWallet,
//     connectorId: ConnectorNames.Injected,
//   },
];

export default connectors;
export const connectorLocalStorageKey = "connectorId";