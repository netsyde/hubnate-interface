import "../styles/index.scss";
import Main from './index'
import Donate from './donate'


import type { AppProps /*, AppContext */ } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default App;