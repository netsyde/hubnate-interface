import { useContext } from 'react'

import { SnackBarContext } from './SnackbarContext'

const useSnackBar = () => useContext(SnackBarContext)

export default useSnackBar