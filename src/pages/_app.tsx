
import ErrorBoundary from '@/components/common/ErrorBoundary'
import MetaTags from '@/components/common/MetaTags'
import Notifications from '@/components/common/Notifications'
import PageLayout from '@/components/common/PageLayout'
import { cgwDebugStorage } from '@/components/sidebar/DebugToggle'
import { GATEWAY_URL_PRODUCTION, GATEWAY_URL_STAGING, IS_PRODUCTION } from '@/config/constants'
import { useInitSafeCoreSDK } from '@/hooks/coreSDK/useInitSafeCoreSDK'
import useAdjustUrl from '@/hooks/useAdjustUrl'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useInitSession } from '@/hooks/useInitSession'
import useLoadableStores from '@/hooks/useLoadableStores'
import { useSafeMsgTracking } from '@/hooks/useSafeMsgTracking'
import useSafeNotifications from '@/hooks/useSafeNotifications'
import useTxNotifications from '@/hooks/useTxNotifications'
import useTxPendingStatuses from '@/hooks/useTxPendingStatuses'
import { useTxTracking } from '@/hooks/useTxTracking'
import { useInitWeb3 } from '@/hooks/wallets/useInitWeb3'
import { useInitOnboard } from '@/hooks/wallets/useOnboard'
import Sentry from '@/services/sentry'; // needs to be imported first
import { StoreHydrator } from '@/store'
import '@/styles/globals.css'
import createEmotionCache from '@/utils/createEmotionCache'
import { CacheProvider, type EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import type { Theme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import { setBaseUrl as setGatewayBaseUrl } from '@safe-global/safe-gateway-typescript-sdk'
import { SafeThemeProvider } from '@safe-global/safe-react-components'
import { Analytics } from '@vercel/analytics/react'
import { type AppProps } from 'next/app'
import Head from 'next/head'
import type { ReactNode } from 'react'
import { type ReactElement } from 'react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { Modals } from '@/components/chat/modals'

const { provider, webSocketProvider } = configureChains([mainnet], [publicProvider()])

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
})

import useSafeMessageNotifications from '@/hooks/useSafeMessageNotifications'
import useSafeMessagePendingStatuses from '@/hooks/useSafeMessagePendingStatuses'

const GATEWAY_URL = IS_PRODUCTION || cgwDebugStorage.get() ? GATEWAY_URL_PRODUCTION : GATEWAY_URL_STAGING

const InitApp = (): null => {
  setGatewayBaseUrl(GATEWAY_URL)
  useAdjustUrl()
  useInitSession()
  useLoadableStores()
  useInitOnboard()
  useInitWeb3()
  useInitSafeCoreSDK()
  useTxNotifications()
  useSafeMessageNotifications()
  useSafeNotifications()
  useTxPendingStatuses()
  useSafeMessagePendingStatuses()
  useTxTracking()
  useSafeMsgTracking()

  return null
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export const AppProviders = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const isDarkMode = useDarkMode()
  const themeMode = isDarkMode ? 'dark' : 'light'

  return (
    <SafeThemeProvider mode={themeMode}>
      {(safeTheme: Theme) => (
        <ThemeProvider theme={safeTheme}>
          <Sentry.ErrorBoundary showDialog fallback={ErrorBoundary}>
            {children}
          </Sentry.ErrorBoundary>
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  )
}

interface WebCoreAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const WebCoreApp = ({
  Component,
  pageProps,
  router,
  emotionCache = clientSideEmotionCache,
}: WebCoreAppProps): ReactElement => {
  return (
    <StoreHydrator>
      <WagmiConfig client={client}>
          <Head>
            <title key="default-title">{'Decentra{Pro}'}</title>
            <MetaTags prefetchUrl={GATEWAY_URL} />
          </Head>

          <CacheProvider value={emotionCache}>
            <AppProviders>
              <CssBaseline />

              <InitApp />
              <PageLayout pathname={router.pathname}>
                <>
                  <Modals />
                  <Component {...pageProps} key={router.query.safe?.toString()} />
                  <Analytics />
                </>
              </PageLayout>
              <Notifications />
            </AppProviders>
          </CacheProvider>
      </WagmiConfig>
    </StoreHydrator>
  )
}

export default WebCoreApp
