import "../styles/index.scss";
import type { AppProps } from 'next/app';
import React from "react";
import Head from 'next/head';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from '@src/utils/web3react';
import { Provider } from 'mobx-react';
import rootStore from '@src/store/RootStore';
import { ModalProvider } from '@src/widgets/Modal'
import { SnackbarProvider } from '@src/widgets/Snackbar'
import { appWithTranslation } from 'next-i18next'
const druid = require('@images/druid.jpg')
const APP_NAME = 'Hubnate';
const APP_DESCRIPTION = 'Donate to random people and increase the chance to get a reward from someone else';
const stores = { rootStore };

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Hubnate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:site_name" content="Hubnate"/>
        <meta name="og:title" content={"Random Donate System"}/>
        <meta name="og:description" content={"Donate to random people and increase the chance to get a reward from someone else"}/>
        <meta name="og:image" content={druid}/>

        <meta name='application-name' content={APP_NAME} />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content={APP_NAME} />
        <meta name='description' content={APP_DESCRIPTION} />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content='#FFFFFF' />
        <link rel='apple-touch-icon' sizes='256x256' href='/favicon.png' />
        <link rel='manifest' href='/manifest.json' />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </Head>
        <Provider { ...stores }>
          <Web3ReactProvider getLibrary={getLibrary}>
            <SnackbarProvider>
              <ModalProvider>
                <Component {...pageProps} />
              </ModalProvider>
            </SnackbarProvider>
          </Web3ReactProvider>
        </Provider>
    </>
  )
}

export default appWithTranslation(App)