import ConnectWallet from '@/components/common/ConnectWallet'
import NotificationCenter from '@/components/notification-center/NotificationCenter'
import { AppRoutes } from '@/config/routes'
import useChainId from '@/hooks/useChainId'
import { useDarkMode } from '@/hooks/useDarkMode'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useAppDispatch } from '@/store'
import { setDarkMode } from '@/store/settingsSlice'
import ChatIcon from '@/public/images/chat/chat-bubble-svgrepo-com.svg'
import MenuIcon from '@mui/icons-material/Menu'
import MenuBookIcon from '@/public/images/chat/book-svgrepo-com.svg'
import ModeNightIcon from '@/public/images/chat/moon-svgrepo-com.svg'
import WalletIcon from '@/public/images/chat/wallet-svgrepo-com.svg'
import WbSunnyIcon from '@/public/images/chat/sun-svgrepo-com.svg'
import { Box, Button, FormControlLabel, IconButton, Paper } from '@mui/material'
import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Dispatch, SetStateAction } from 'react'
import { useState, type ReactElement } from 'react'
import css from './styles.module.css'

type HeaderProps = {
  onMenuToggle?: Dispatch<SetStateAction<boolean>>
}

const Header = ({ onMenuToggle }: HeaderProps): ReactElement => {
  const chainId = useChainId()
  const { safe, safeAddress } = useSafeInfo()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isDarkMode = useDarkMode()

  // Logo link: if on Dashboard, link to Welcome, otherwise to the root (which redirects to either Dashboard or Welcome)
  const logoHref = router.pathname === AppRoutes.home ? AppRoutes.chat : AppRoutes.index

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle((isOpen) => !isOpen)
    } else {
      router.push(logoHref)
    }
  }

  const buttonPages = [
    AppRoutes.wallet,
    AppRoutes.chat,
    AppRoutes.addressBook
  ]

  const [selectedButton, setSelectedButton] = useState(AppRoutes.chat);

  return (
    <Paper className={css.container}>
      <div className={classnames(css.element, css.menuButton, !onMenuToggle ? css.hideSidebarMobile : null)}>
        <IconButton onClick={handleMenuToggle} size="large" edge="start" color="default" aria-label="menu">
          <MenuIcon />
        </IconButton>
      </div>

      <div className={classnames(css.element, css.hideMobile)}>
        <Link href={logoHref} passHref>
          <b>
            Decentra&#123;Pro&#125;
          </b>
        </Link>
      </div>

      <Box display='flex' alignItems='center' className={css.hideMobile}>
        {buttonPages.map(path =>
          <Link href={{ pathname: path }} key={`${safe}`} passHref>
            <Button onClick={() => setSelectedButton(path)} startIcon={path === AppRoutes.wallet ? <WalletIcon /> : path === AppRoutes.chat ? <ChatIcon /> : <MenuBookIcon />} className={router.pathname.startsWith(path) ? css.ButtonNavSelected : css.ButtonNav} size='small'>{path === AppRoutes.wallet ? 'Wallet' : path === AppRoutes.chat ? 'Chat' : 'Address book'}</Button>
          </Link>
        )}
      </Box>

      <Box display='flex' alignItems='center' justifyContent='space-evenly'>
        <div className={classnames(css.element)}>
          <FormControlLabel
            sx={{ margin: 0 }}
            control={
              <IconButton color="inherit" onClick={() => dispatch(setDarkMode(!isDarkMode))}>
                {isDarkMode ? <WbSunnyIcon /> : <ModeNightIcon />}
              </IconButton>
            }
            label=""
          />
        </div>

        <div className={classnames(css.paddingleftelement, css.element, css.hideMobile)}>
          <NotificationCenter />
        </div>

        <div className={classnames(css.element, css.connectWallet)}>
          <ConnectWallet />
        </div>
      </Box>
    </Paper>
  )
}

export default Header
