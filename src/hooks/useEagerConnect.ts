import { useEffect } from 'react'
import useAuth from '@src/hooks/useAuth';
import { useSnackbar } from '@src/widgets/Snackbar'

enum ConnectorNames {
    Injected = "injected",
    WalletConnect = "walletconnect",
    BSC = "bsc",
}

const _binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc
      },
      set(bsc) {
        this.bsc = bsc

        resolve()
      },
    }),
  )

const useEagerConnect = () => {
  try {
    const { login } = useAuth()
    const { addAlert } = useSnackbar() 

    useEffect(() => {
      try {
        const connectorId = window.localStorage.getItem("connectorId") as ConnectorNames

        if (connectorId) {
          const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
          const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

          // Currently BSC extension doesn't always inject in time.
          // We must check to see if it exists, and if not, wait for it before proceeding.
          if (isConnectorBinanceChain && !isBinanceChainDefined) {
            _binanceChainListener().then(() => login(connectorId))

            return
          }

          login(connectorId)
        }
      } catch (e) {
        addAlert(e.message)
        console.log(e)
      }
    }, [login])
  } catch (e) {
    console.log('useEagerConnect error', e)
  }
}

export default useEagerConnect