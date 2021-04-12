import "../styles/index.scss";
import type { AppProps /*, AppContext */ } from 'next/app'
import React from "react";
import Head from 'next/head'
const druid = require('@images/druid.jpg')

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Hubnate</title>
        <meta name="description" content="Donate to random people and increase the chance to get a reward from someone else"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:site_name" content="Hubnate"/>
        <meta name="og:title" content={"Random Donate System"}/>
        <meta name="og:description" content={"Donate to random people and increase the chance to get a reward from someone else"}/>
        <meta name="og:image" content={druid}/>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App;