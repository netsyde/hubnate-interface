import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { connectorsByName } from '@src/utils/web3react'
import { setupNetwork } from '@src/utils/wallet'

enum ConnectorNames {
    Injected = "injected",
    WalletConnect = "walletconnect",
    BSC = "bsc",
}

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]
    console.log(connector)
    if (connector) {
      console.log('connector exist')
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          console.log('UnsupportedChainIdError')
          const hasSetup = await setupNetwork()
          if (hasSetup) {
            console.log('hasSetup')
            activate(connector)
          }
        } else {
          window.localStorage.removeItem("connectorId")
          if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
              console.log('Provider Error', 'No provider was found')
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector as WalletConnectConnector
              walletConnector.walletConnectProvider = null
            }

            console.log('Authorization Error ', 'Please authorize to access your account')
          } else {
            console.log(error.name, error.message)
            // toastError(error.name, error.message)
          }
        }
      })
    } else {
        console.log("Can't find connector", 'The connector config is wrong')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { login, logout: deactivate }
}

export default useAuth