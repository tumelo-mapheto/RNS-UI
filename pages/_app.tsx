import '@fontsource/jetbrains-mono/latin.css'
import '@fontsource/roboto/latin.css'

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from 'contexts/wallet'
import { ThemeProvider } from 'contexts/theme'
import Layout from 'components/Layout'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { NETWORK } from 'utils/constants'

function MyApp({ Component, pageProps }: AppProps) {
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [network, setNetwork] = useState(NETWORK)

  return (
    <ThemeProvider isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme}>
      <WalletProvider network={network} setNetwork={setNetwork}>
        <Toaster position="top-right" />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletProvider>
    </ThemeProvider>
  )
}

export default MyApp
