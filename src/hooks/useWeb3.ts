import { useEffect, useState, useRef } from 'react'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import { getWeb3NoAccount } from '@src/utils/web3'
import { useSnackbar } from '@src/widgets/Snackbar'

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the provider change
 */
const useWeb3 = () => {
  try {
    const { library } = useWeb3React()
    const { addAlert } = useSnackbar() 
    const refEth = useRef(library)
    const [web3, setweb3] = useState(library ? new Web3(library) : getWeb3NoAccount())

    useEffect(() => {
      try {
        if (library !== refEth.current) {
          setweb3(library ? new Web3(library) : getWeb3NoAccount())
          refEth.current = library
        }
      } catch (e) {
        addAlert(e.message)
        console.log(e)
      }
    }, [library])

    return web3
  } catch (e) {
    console.log('useWeb3 error', e)
  }
}

export default useWeb3