import { IS_PRODUCTION } from '@/config/constants'
import { ContentSecurityPolicy, StrictTransportSecurity } from '@/config/securityHeaders'
import { lightPalette, darkPalette } from '@safe-global/safe-react-components'

const descriptionText =
  'Decentra is building on top of Safe (prev. Gnosis Safe) which is the most trusted platform to manage digital assets on Ethereum and multiple EVMs. Over $50B secured.'
const titleText = 'Decentra{Pro}'

const MetaTags = ({ prefetchUrl }: { prefetchUrl: string }) => (
  <>
    <meta name="description" content={descriptionText} />

    {/* Social sharing */}
    <meta name="og:image" content="https://app.decentra.so/images/social-share.png" />
    <meta name="og:description" content={descriptionText} />
    <meta name="og:title" content={titleText} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@DecentraHQ" />
    <meta name="twitter:title" content={titleText} />
    <meta name="twitter:description" content={descriptionText} />
    <meta name="twitter:image" content="https://app.decentra.so/images/social-share.png" />

    {/* CSP */}
    <meta httpEquiv="Content-Security-Policy" content={ContentSecurityPolicy} />
    {IS_PRODUCTION && <meta httpEquiv="Strict-Transport-Security" content={StrictTransportSecurity} />}

    {/* Prefetch the backend domain */}
    <link rel="dns-prefetch" href={prefetchUrl} />
    <link rel="preconnect" href={prefetchUrl} crossOrigin="" />

    {/* Mobile tags */}
    <meta name="viewport" content="width=device-width" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    {/* PWA primary color and manifest */}
    <meta name="theme-color" content={lightPalette.background.main} media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content={darkPalette.background.main} media="(prefers-color-scheme: dark)" />
    <link rel="manifest" href="/safe.webmanifest" />

    {/* Favicons */}
    <link rel="shortcut icon" href="/favicons/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
    <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000" />
  </>
)

export default MetaTags
