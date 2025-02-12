import type { ReactElement } from 'react'
import { Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { useAppDispatch } from '@/store'
import { AppRoutes } from '@/config/routes'
import packageJson from '../../../../package.json'
import AppstoreButton from '../AppStoreButton'
import ExternalLink from '../ExternalLink'
import MUILink from '@mui/material/Link'

const footerPages = [
  AppRoutes.settings.index,
  AppRoutes.imprint,
  AppRoutes.privacy,
  AppRoutes.terms,
  AppRoutes.licenses,
]

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  if (!footerPages.some((path) => router.pathname.startsWith(path))) {
    return null
  }

  return (
    <footer className={css.container}>
      <ul>
        <li>
          <Typography variant="caption">&copy;2022–{new Date().getFullYear()} Core Contributors GmbH</Typography>
        </li>
        <li>
          <Link href={AppRoutes.terms} passHref>
            <MUILink>Terms</MUILink>
          </Link>
        </li>
        <li>
          <Link href={AppRoutes.privacy} passHref>
            <MUILink>Privacy</MUILink>
          </Link>
        </li>
        <li>
          <Link href={AppRoutes.licenses} passHref>
            <MUILink>Licenses</MUILink>
          </Link>
        </li>
        <li>
          <Link href={AppRoutes.imprint} passHref>
            <MUILink>Imprint</MUILink>
          </Link>
        </li>
        <li>
          <ExternalLink noIcon href={`${packageJson.homepage}/releases/tag/v${packageJson.version}`}>
            v{packageJson.version}
          </ExternalLink>
        </li>
        <li>
          <AppstoreButton placement="footer" />
        </li>
      </ul>
    </footer>
  )
}

export default Footer
