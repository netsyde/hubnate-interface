
import { createContext, useState, useCallback, useMemo, useEffect } from 'react'

interface ISnackBarContext {
    addAlert: (alert: string) => any
}

export const SnackBarContext = createContext<ISnackBarContext>({
    addAlert: (alert: string) => null
})

const AUTO_DISMISS = 4000

interface ISnackBarProvider {
    children?: any,
    addAlert?: () => any
}

interface ISnackbar {
    children?: any
}

const SnackBar = (props: ISnackbar) => {
    return (
        <div className="snackbar snackbar-fade">
            <p>
                {props.children}
            </p>
        </div>
    )
}
export default function SnackBarProvider(props: ISnackBarProvider) {
  const [alerts, setAlerts] = useState([])
  
  const activeAlertIds = alerts.join(',')
  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(() => setAlerts((alerts) => alerts.slice(0, alerts.length - 1)), AUTO_DISMISS)
      return () => clearTimeout(timer)
    }
  }, [activeAlertIds])

  const addAlert = useCallback((content) => setAlerts((alerts) => [content, ...alerts]), [])

  const value: any = useMemo(() => ({ addAlert }), [addAlert])
    
  return (
    <SnackBarContext.Provider value={value}>
      {props.children}
      <div className="snackbars">
        {alerts.map((alert, index) => <SnackBar key={index}>{alert}</SnackBar>)}
      </div>
    </SnackBarContext.Provider>
  )
}